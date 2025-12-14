class Employee {
  constructor(id, name, email, password, salary, address, categoryId, image) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.salary = salary;
    this.address = address;
    this.categoryId = categoryId;
    this.image = image;
  }
}

module.exports = Employee;
