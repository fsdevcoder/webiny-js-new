import {attributes} from 'webiny-model'

class BooleanAttribute extends attributes.boolean {
    /**
     * We must make sure a boolean value is sent, and not 0 or 1, which are stored in MySQL.
     * @param value
     */
    setStorageValue(value) {
        return this.setValue(!!value);
    }
}

export default BooleanAttribute;