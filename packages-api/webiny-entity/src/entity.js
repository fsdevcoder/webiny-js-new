const Driver = require('./driver');
const EventHandler = require('./eventHandler');
const EntityCollection = require('./entityCollection');
const _ = require('lodash');

class Entity {
	constructor() {
		const proxy = new Proxy(this, {
			set: (instance, key, value) => {
				const attr = instance.getModel().getAttribute(key);
				if (attr) {
					attr.setValue(value);
					return true;
				}

				instance[key] = value;
				return true;
			},
			get: (instance, key) => {
				if (['classId', 'driver'].includes(key)) {
					return instance.constructor[key];
				}

				const attr = instance.getModel().getAttribute(key);
				if (attr) {
					return attr.getValue();
				}

				return instance[key];
			}
		});

		this.model = this.getDriver().getModelClass();
		this.model = new this.model().setParentEntity(proxy);

		if (!this.model) {
			throw Error('Entity model is missing.');
		}

		this.listeners = {};
		this.existing = false;
		this.processing = false;

		this.getDriver().onEntityConstruct(proxy);

		if (!this.getAttribute('id')) {
			this.attr('id').char();
		}

		return proxy;
	}

	/**
	 * Returns instance of entity's model.
	 * @returns {*}
	 */
	getModel() {
		return this.model;
	}

	/**
	 * Returns instance of used driver.
	 * @returns {Driver}
	 */
	static getDriver() {
		return this.driver;
	}

	/**
	 * Returns instance of used driver.
	 * @returns {Driver}
	 */
	getDriver() {
		return this.constructor.driver;
	}

	/**
	 * Sets whether entity is existing or not.
	 * @param flag
	 * @returns {Entity}
	 */
	setExisting(flag = true) {
		this.existing = flag;
		return this;
	}

	/**
	 * Returns true if entity exists or in other words, is already saved in storage. Otherwise returns false.
	 * @returns {boolean|*}
	 */
	isExisting() {
		return this.existing;
	}

	/**
	 * Creates new attribute with name.
	 * @param name
	 * @returns {*}
	 */
	attr(name) {
		return this.getModel().getAttributesContainer().attr(name);
	}

	/**
	 * Returns single attribute by given name.
	 * @param name
	 * @returns {*|string}
	 */
	getAttribute(name) {
		return this.getModel().getAttribute(name);
	}

	/**
	 * Returns all entity's attributes.
	 * @returns {*}
	 */
	getAttributes() {
		return this.getModel().getAttributes();
	}

	async get(path, defaultValue) {
		return _.get(await this.toJSON(path), path, defaultValue);
	}

	async set(path, defaultValue) {
		return _.get(await this.toJSON(path), path, defaultValue);
	}

	/**
	 * Returns entity's JSON representation.
	 * @param path
	 * @returns {Promise<void>}
	 */
	async toJSON(path = null) {
		return this.getModel().toJSON(path);
	}

	/**
	 * Returns data suitable for storage.
	 * @returns {Promise<Promise<*>|*|Promise<{}>>}
	 */
	async toStorage() {
		return this.getModel().toStorage();
	}

	/**
	 * Validates current entity and throws exception that contains all invalid attributes.
	 * @returns {Promise<void>}
	 */
	async validate() {
		return this.getModel().validate();
	}

	/**
	 * Used to populate entity with given data.
	 * @param data
	 * @returns {Entity}
	 */
	populate(data) {
		this.getModel().populate(data);
		return this;
	}

	/**
	 * Used when populating entity with data from storage.
	 * @param data
	 * @returns {Entity}
	 */
	populateFromStorage(data) {
		this.getModel().populateFromStorage(data);
		return this;
	}

	/**
	 * Saves current and all linked entities (if autoSave on the attribute was enabled).
	 * @param params
	 * @returns {Promise<*>}
	 */
	async save(params = {}) {
		if (this.processing) {
			return;
		}

		this.processing = true;

		const existing = this.isExisting();

		try {
			await this.validate();

			if (existing) {
				await this.emit('beforeUpdate');
			} else {
				await this.emit('beforeCreate');
			}

			await this.emit('beforeSave');
			await this.getDriver().save(this, params);
			this.setExisting();
			await this.emit('afterSave');

			if (existing) {
				await this.emit('afterUpdate');
			} else {
				await this.emit('afterCreate');
			}

			this.getModel().clean();
		} catch (e) {
			throw e;
		} finally {
			this.processing = false;
		}
	}

	/**
	 * Executed before delete method. It can be used check if an entity can be deleted and to throw errors if needed.
	 */
	async canDelete() {
		// Does not do anything / perform any checks by default.
	}

	/**
	 * Deletes current and all linked entities (if autoDelete on the attribute was enabled).
	 * @param params
	 * @returns {Promise<*>}
	 */
	async delete(params = {}) {
		if (this.processing) {
			return;
		}

		this.processing = true;

		try {
			if (this.getAttribute('id').isEmpty()) {
				throw Error('Entity cannot be deleted because it was not previously saved.');
			}

			if (!(params.skipCanDelete)) {
				await this.canDelete();
			}

			await this.emit('beforeDelete');
			await this.getDriver().delete(this, params);
			await this.emit('afterDelete');
		} catch (e) {
			throw e;
		} finally {
			this.processing = false;
		}
	}

	/**
	 * Tells us whether a given ID is valid or not.
	 * @param id
	 * @param params
	 * @returns {*}
	 */
	isId(id, params = {}) {
		return this.getDriver().isId(this, id, _.cloneDeep(params));
	}

	/**
	 * Tells us whether a given ID is valid or not.
	 * @param id
	 * @param params
	 * @returns {*}
	 */
	static isId(id, params = {}) {
		return this.getDriver().isId(this, id, _.cloneDeep(params));
	}

	/**
	 * Finds a single entity matched by given ID.
	 * @param id
	 * @param params
	 * @returns {Promise<*>}
	 */
	static async findById(id, params = {}) {
		const paramsClone = _.cloneDeep(params);
		await this.emit('query', {type: 'findById', id, params: paramsClone});
		if (!id) {
			return null;
		}

		const queryResult = await this.getDriver().findById(this, id, paramsClone);
		if (queryResult.getResult()) {
			return new this().setExisting().populateFromStorage(queryResult.getResult());
		}
		return null;
	}

	/**
	 * Finds one or more entities matched by given IDs.
	 * @param ids
	 * @param params
	 * @returns {Promise<*>}
	 */
	static async findByIds(ids, params = {}) {
		const paramsClone = _.cloneDeep(params);
		await this.emit('query', {type: 'findByIds', params: paramsClone});

		const queryResult = await this.getDriver().findByIds(this, ids, paramsClone);
		const entityCollection = new EntityCollection().setParams(paramsClone).setMeta(queryResult.getMeta());
		if (queryResult.getResult()) {
			for (let i = 0; i < queryResult.getResult().length; i++) {
				entityCollection.push(new this().setExisting().populateFromStorage(queryResult.getResult()[i]));
			}
		}

		return entityCollection;
	}

	/**
	 * Finds one entity matched by given query parameters.
	 * @param params
	 * @returns {Promise<*>}
	 */
	static async findOne(params = {}) {
		const paramsClone = _.cloneDeep(params);
		await this.emit('query', {type: 'findOne', params: paramsClone});

		const queryResult = await this.getDriver().findOne(this, paramsClone);
		if (queryResult.getResult()) {
			return new this().setExisting().populateFromStorage(queryResult.getResult());
		}
		return null;
	}

	/**
	 * Finds one or more entities matched by given query parameters.
	 * @param params
	 * @returns {Promise<*>}
	 */
	static async find(params = {}) {
		const paramsClone = _.cloneDeep(params);
		await this.emit('query', {type: 'find', params: paramsClone});

		const queryResult = await this.getDriver().find(this, paramsClone);
		const entityCollection = new EntityCollection().setParams(paramsClone).setMeta(queryResult.getMeta());
		if (queryResult.getResult()) {
			for (let i = 0; i < queryResult.getResult().length; i++) {
				entityCollection.push(await new this().setExisting().populateFromStorage(queryResult.getResult()[i]).emit('loaded'));
			}
		}

		return entityCollection;
	}

	/**
	 * Counts total number of entities matched by given query paramters.
	 * @param params
	 * @returns {Promise<*>}
	 */
	static async count(params = {}) {
		const paramsClone = _.cloneDeep(params);
		await this.emit('query', {type: 'count', params: paramsClone});

		const queryResult = await this.getDriver().count(this, paramsClone);
		return queryResult.getResult();
	}

	/**
	 * Registers a listener that will be triggered only on current entity instance.
	 * @param name
	 * @param callback
	 * @returns {EventHandler}
	 */
	on(name, callback) {
		const eventHandler = new EventHandler(name, callback);
		if (!this.listeners[eventHandler.getName()]) {
			this.listeners[eventHandler.getName()] = [];
		}
		this.listeners[eventHandler.getName()].push(eventHandler);
		return eventHandler;
	}

	/**
	 * Registers a listener that will be triggered on all entity instances of current class.
	 * @param name
	 * @param callback
	 * @returns {EventHandler}
	 */
	static on(name, callback) {
		if (!this.listeners) {
			this.listeners = {};
		}

		const eventHandler = new EventHandler(name, callback);
		if (!this.listeners[eventHandler.getName()]) {
			this.listeners[eventHandler.getName()] = [];
		}
		this.listeners[eventHandler.getName()].push(eventHandler);
		return eventHandler;
	}

	/**
	 * Emits an event, which will trigger both static and instance listeners.
	 * @param name
	 * @param data
	 * @returns {Promise<Entity>}
	 */
	async emit(name, data) {
		if (this.listeners[name]) {
			for (let i = 0; i < this.listeners[name].length; i++) {
				await this.listeners[name][i].execute({...data, entity: this});
			}
		}

		if (this.constructor.listeners) {
			if (this.constructor.listeners[name]) {
				for (let i = 0; i < this.constructor.listeners[name].length; i++) {
					await this.constructor.listeners[name][i].execute({...data, entity: this});
				}
			}
		}
		return this;
	}

	/**
	 * Emits an event, which will trigger static event listeners.
	 * @param name
	 * @param data
	 * @returns {Promise<void>}
	 */
	static async emit(name, data) {
		if (_.get(this, 'listeners.name')) {
			for (let i = 0; i < this.listeners[name].length; i++) {
				await this.listeners[name][i].execute({...data, entity: this});
			}
		}
	}
}

Entity.classId = null;
Entity.driver = new Driver();

module.exports = Entity;