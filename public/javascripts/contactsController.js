import debounce from './debounce.js';

export class ContactController {
  constructor(contactsManager, contactsView) {
    this.manager = contactsManager;
    this.view = contactsView;
    this.manager.controller = this;
    this.view.controller = this;
    this.renderContacts();
  }

  bindEvents() {
    document.querySelectorAll('#add').forEach(button => {
      button.addEventListener('click', this.handleClickAdd);
    });

    document.querySelectorAll('.edit').forEach(button => {
      button.addEventListener('click', this.handleEdit);
    });

    document.querySelectorAll('.delete').forEach(button => {
      button.addEventListener('click', this.handleDelete);
    });

    this.handleSearch();
    document.querySelector('#tags-div').addEventListener('click', this.retrieveContactsByTag);
  }

  handleClickAdd = () => {
    this.view.showAddForm();
    document.querySelector('#addForm').addEventListener('submit', this.manager.addContact.bind(this.manager));
    document.querySelector('#cancel').addEventListener('click', this.resetView);
  }

  handleEdit = async (event) => {
    let id = event.target.value;
    let contact = await this.manager.retrieveSingleContact(id);
    this.view.showEditForm(contact);
    document.querySelector('#edit-form').addEventListener('submit', this.manager.editContact.bind(this.manager, contact));
    document.querySelector('#cancel').addEventListener('click', this.resetView);
  }

  handleDelete = (event) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      let id = event.target.value;
      this.manager.deleteContact(id);
    }
  }

  handleSearch = () => {
    let inputSearch = document.querySelector('#search');

    let search = async () => {
      let string = inputSearch.value;
      let contacts = await this.manager.searchContacts(string);
      this.view.renderContactsView(contacts);

      inputSearch.value = string;
      this.bindEvents();
    };

    let debouncedSearch = debounce(search, 1000);

    inputSearch.addEventListener('input', debouncedSearch);
  }

  resetView = () => {
    this.renderContacts();
  }

  retrieveContactsByTag = () => {
    this.renderContacts(event.target.textContent);
  }

  renderContacts = async (tag = false) => {
    let contacts = await this.manager.retrieveContacts(tag);
    if (contacts.length === 0) {
      this.view.renderNoContacts();
    } else {
      this.view.renderContactsView(contacts);
    }
    this.bindEvents();
  }
}