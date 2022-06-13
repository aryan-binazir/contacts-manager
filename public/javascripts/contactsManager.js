/* eslint-disable max-lines-per-function */
export class ContactsManager {
  addContact = async (event) => {
    event.preventDefault();
    let form = document.querySelector('#addForm');

    const json = this.convertFormToJson(form);
    if (this.validate(json)) {
      let url = 'http://localhost:3000/api/contacts/';
      let options = {
        method: 'POST',
        body: json,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        }
      };
      let response = await this.makeRequest(url, options);

      if (response.ok) alert('Successfully added!');
    } else {
      alert('Name field cannot be blank.');
    }
    this.controller.resetView();
  }

  retrieveSingleContact = async (id) => {
    let url = 'http://localhost:3000/api/contacts/' + id;
    let data = await this.makeRequest(url, {});
    let json = await data.json();

    return json;
  }

  retrieveContacts = async (tag = false) => {
    if (tag === 'all contacts') tag = false;

    const url = 'http://localhost:3000/api/contacts';
    const response = await this.makeRequest(url, {});

    if (response.ok) {
      let contacts = await response.json();

      if (tag) {
        contacts = this.returnTags(contacts, tag);
      }
      return contacts;
    }
  }

  searchContacts = async (string) => {
    const searchRegex = new RegExp(string, 'i');
    let contactsList = await this.retrieveContacts();
    let searchResults = contactsList.filter(contact => {
      return searchRegex.test(contact.full_name);
    });

    return searchResults;
  }

  async editContact(contact) {
    event.preventDefault();

    let json = this.convertFormToJson(document.querySelector('#edit-form'));
    json = this.addPairToJson(json, {id: contact.id});

    if (this.validate(json)) {
      let url = 'http://localhost:3000/api/contacts/' + contact.id;
      let options = {
        method: 'PUT',
        body: json,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        }
      };

      let response = await this.makeRequest(url, options);

      if (response.ok) {
        alert('Successfully updated!');
      }
    } else {
      alert('Name field cannot be blank!');
    }

    this.controller.resetView();
  }

  async deleteContact(id) {
    let url = 'http://localhost:3000/api/contacts/' + id;
    let options = { method: 'DELETE' };
    const response = await this.makeRequest(url, options);

    if (response.ok) {
      alert('successfully deleted!');
    }

    this.controller.resetView();
  }

  //helper methods
  validate(json) {
    let result = false;
    if (JSON.parse(json).full_name.trim() !== '') {
      result = true;
    }
    return result;
  }

  addPairToJson(json, objectPair) {
    let object = JSON.parse(json);
    let key = Object.keys(objectPair)[0];
    object[key] = objectPair[key];
    return JSON.stringify(object);
  }

  makeRequest = async (url, options) => {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (err) {
      alert(err);
    }
  }

  convertFormToJson = (form) => {
    let formData = new FormData(form);
    let object = Object.fromEntries(formData);

    const json = JSON.stringify(object);
    return json;
  }

  returnTags(contacts, tag) {
    let result = contacts.filter(contact => {
      let tags = contact.tags.split(',').map(tag => tag.trim().toLowerCase());
      return (tags.includes(tag));
    });
    return result;
  }
}