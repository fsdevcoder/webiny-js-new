import {assert} from 'chai';
import User from './entities/user'

describe('default driver test', function () {
    it('save method should return the same user instance', async () => {
        const user = new User();
        const res = await user.save();
        assert.isUndefined(res);
    });

    it('delete method should return undefined', async () => {
        const user = new User();

        let error = null;
        try {
			await user.delete();
		} catch (e) {
        	error = e;
		}

		assert.instanceOf(error, Error);

        user.id = 'ABC';
		assert.isUndefined(await user.delete());
    });

    it('findById method should return null', async () => {
        const user = await User.findById(12345);
        assert.isNull(user);
    });

    it('findOne method should return null', async () => {
        const user = await User.findOne({query: {id: 12345}});
        assert.isNull(user);
    });

    it('find method should return empty array', async () => {
        const users = await User.find({query: 12345});
        assert.isArray(users);
        assert.isEmpty(users);
    });

    it('count method should return zero', async () => {
        assert.equal(await User.count(), 0);
    });
});