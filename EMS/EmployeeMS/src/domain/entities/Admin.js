export class Admin {
  constructor(id, email, password = null) {
    this.id = id;
    this.email = email;
    this.password = password;
  }
}
