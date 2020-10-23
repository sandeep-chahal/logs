const validator = (name, value) => ({
	errors: { hasError: false, array: [] },
	name,
	value,
	isEmail() {
		if (
			!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
				this.value
			)
		) {
			this.errors.hasError = true;
			this.errors.array.push({
				field: name,
				msg: `Invalid Email.`,
			});
		}
		return this;
	},
	hasLength(options = { min: -Infinity, max: Infinity }) {
		if (this.value.length < options.min) {
			this.errors.hasError = true;
			this.errors.array.push({
				field: name,
				msg: `${name} length should be not be less than ${options.min}.`,
			});
		}
		if (this.value.length > options.max) {
			this.errors.hasError = true;
			this.errors.array.push({
				field: name,
				msg: `${name} length should be not be greater than ${options.max}.`,
			});
		}

		return this;
	},
	notEmpty() {
		if (!this.value.trim()) {
			this.errors.hasError = true;
			this.errors.array.push({
				field: name,
				msg: `${name} can't be empty.`,
			});
		}
		return this;
	},
	isString() {
		if (typeof this.value !== "string") {
			this.errors.hasError = true;
			this.errors.array.push({
				field: name,
				msg: `${name} should be string.`,
			});
		}
		return this;
	},
	isNumber() {
		if (typeof this.value !== "number") {
			this.errors.hasError = true;
			this.errors.array.push({
				field: name,
				msg: `${name} should be number.`,
			});
		}
		return this;
	},
	hasValue(options = { min: -Infinity, max: Infinity, exact: null }) {
		if (this.value < options.min) {
			this.errors.hasError = true;
			this.errors.array.push({
				field: name,
				msg: `${name} should be not be less than ${options.min}.`,
			});
		}
		if (this.value > options.max) {
			this.errors.hasError = true;
			this.errors.array.push({
				field: name,
				msg: `${name} should be not be greater than ${options.max}.`,
			});
		}
		if (options.exact && this.value !== options.exact) {
			this.errors.hasError = true;
			this.errors.array.push({
				field: name,
				msg: `${name} should be equals to ${options.exact}.`,
			});
		}
		return this;
	},
});

export default validator;
