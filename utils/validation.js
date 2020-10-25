import mongoose from "mongoose";

const validator = (name, value) => ({
	errors: { hasError: false, array: [] },
	name,
	value,
	check: true,
	isEmail() {
		if (!this.check) return this;
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
		if (!this.check) return this;

		if (this.value.length < options.min) {
			this.errors.hasError = true;
			this.errors.array.push({
				field: name,
				msg: `${name} length should not be less than ${options.min}.`,
			});
		}
		if (this.value.length > options.max) {
			this.errors.hasError = true;
			this.errors.array.push({
				field: name,
				msg: `${name} length should not be greater than ${options.max}.`,
			});
		}

		return this;
	},
	notEmpty() {
		if (!this.check) return this;
		if (
			!this.value ||
			(typeof this.value === "string" && !this.value.trim()) ||
			typeof this.value === "number"
		) {
			this.check = false;
			this.errors.hasError = true;
			this.errors.array.push({
				field: name,
				msg: `${name} can't be empty.`,
			});
		}
		return this;
	},
	isString() {
		if (!this.check) return this;
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
		if (!this.check) return this;
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
		if (!this.check) return this;

		if (this.value < options.min) {
			this.errors.hasError = true;
			this.errors.array.push({
				field: name,
				msg: `${name} should not be less than ${options.min}.`,
			});
		}
		if (this.value > options.max) {
			this.errors.hasError = true;
			this.errors.array.push({
				field: name,
				msg: `${name} should not be greater than ${options.max}.`,
			});
		}
		if (options.exact && this.value !== options.exact) {
			this.errors.hasError = true;
			this.errors.array.push({
				field: name,
				msg: `${name} should equals to ${options.exact}.`,
			});
		}
		return this;
	},
	isMongoDbId() {
		if (!this.check) return this;
		if (!mongoose.isValidObjectId(this.value)) {
			this.errors.hasError = true;
			this.errors.array.push({
				field: name,
				msg: `Invalid ${name}.`,
			});
		}
		return this;
	},
	isSameUser() {
		if (!this.check) return this;

		if (this.value[0] !== this.value[1]) {
			this.errors.hasError = true;
			this.errors.array.push({
				field: name,
				msg: `You don't have permissions to do this task.`,
			});
		}
		return this;
	},
});

export default validator;
