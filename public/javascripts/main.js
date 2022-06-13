import { ContactController } from "./contactsController.js";
import { ContactsManager } from "./contactsManager.js";
import { ContactsView } from "./contactsView.js";

document.addEventListener('DOMContentLoaded', () => {
  let contactsApp = new ContactController(new ContactsManager(),
    new ContactsView());
});