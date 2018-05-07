// @flow
import type Entity from "./entity";
type ExtensionCallback = ({ id: string, entity: Entity }) => void;

class EntityManager {
    entityClasses: Array<Class<Entity>>;
    extensions: { [key: string]: Array<ExtensionCallback> };

    constructor() {
        this.extensions = {};
        this.entityClasses = [];
    }

    extend(id: string, cb: ExtensionCallback) {
        const callbacks = this.extensions[id] || [];
        callbacks.push(cb);
        this.extensions[id] = callbacks;
    }

    applyExtensions(entity: Entity) {
        const id = entity.constructor.classId;
        const wildcardCallbacks = this.extensions["*"] || [];
        const callbacks = this.extensions[id] || [];
        wildcardCallbacks.map(cb => cb(entity));
        callbacks.map(cb => cb(entity));
    }

    addEntityClass(entityClass: Class<Entity>): EntityManager {
        this.entityClasses.push(entityClass);
        return this;
    }

    getEntityClasses(): Array<Class<Entity>> {
        return this.entityClasses;
    }
}

export default EntityManager;
