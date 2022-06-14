export class ContactsView {
  constructor () {
    this.templates = {};
    this.registerTemplates();
  }

  registerTemplates = () => {
    Handlebars.registerPartial("contact", document.querySelector('#contact-card').innerHTML);
    const contactTemplate = Handlebars.compile(document.querySelector('#contacts').innerHTML);
    const modalTemplate = Handlebars.compile(document.querySelector('#modal-card').innerHTML);
    const editTemplate = Handlebars.compile(document.querySelector('#edit-html').innerHTML);
    const addTemplate = Handlebars.compile(document.querySelector('#add-form').innerHTML);
    const noContactTemplate = Handlebars.compile(document.querySelector('#no-contacts').innerHTML);
    this.templates = { contactTemplate, editTemplate, addTemplate,
      noContactTemplate, modalTemplate };
  }

  showModal(contact) {
    const modal = document.querySelector('#modal');
    const modalLayer = document.querySelector('#modal-layer');
    this.clearContents(modal);
    modalLayer.classList.replace('hide', 'show');
    modal.classList.replace('hide', 'show');

    const html = this.templates.modalTemplate(contact);
    modal.insertAdjacentHTML('beforeend', html);    
  }

  hideModal = () => {
    const modal = document.querySelector('#modal');
    const modalLayer = document.querySelector('#modal-layer');
    this.clearContents(modal);
    modalLayer.classList.replace('show', 'hide');
    modal.classList.replace('show', 'hide');
  }

  showAddForm() {
    const contactsDiv = document.querySelector('#contact-container');
    this.clearContents(contactsDiv);

    const html = this.templates.addTemplate();
    contactsDiv.insertAdjacentHTML('beforeend', html);
  }

  showEditForm(contact) {
    const contactsDiv = document.querySelector('#contact-container');
    this.clearContents(contactsDiv);

    const html = this.templates.editTemplate(contact);
    contactsDiv.insertAdjacentHTML('afterbegin', html);
  }

  renderNoContacts = () => {
    const contactsDiv = document.querySelector('#contact-container');
    this.clearContents(contactsDiv);

    const html = this.templates.noContactTemplate();
    contactsDiv.insertAdjacentHTML('beforeend', html);
  }

  renderContactsView = (contacts) => {
    const html = this.templates.contactTemplate({ contacts: contacts });
    const contactsDiv = document.querySelector('#contact-container');
    const tagDiv = document.querySelector('#tag-container');
    this.clearContents(tagDiv);
    this.clearContents(contactsDiv);
    contactsDiv.insertAdjacentHTML('beforeend', html);
    document.querySelector('#tag-container').appendChild(this.createTagButtons(contacts));
  }

  createTagButtons(contacts) {
    let tagsDiv = document.createElement('div');
    tagsDiv.id = 'tags-div';
    let tags = ['all contacts'];

    contacts.forEach(contact => {
      contact.tags.split(',').forEach(tag => {
        let currentTag = tag.trim().toLowerCase();

        if (!tags.includes(currentTag) && currentTag !== '') {
          tags.push(currentTag);
        }
      });
    });

    tags.forEach(tag => {
      let button = document.createElement('button');
      button.name = 'tags';
      button.textContent = tag;
      tagsDiv.appendChild(button);
    });
    return tagsDiv;
  }

  clearContents(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
}