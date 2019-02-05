import { element, by, ElementFinder } from 'protractor';

export class MailComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-mail div table .btn-danger'));
    title = element.all(by.css('jhi-mail div h2#page-heading span')).first();

    async clickOnCreateButton() {
        await this.createButton.click();
    }

    async clickOnLastDeleteButton() {
        await this.deleteButtons.last().click();
    }

    async countDeleteButtons() {
        return this.deleteButtons.count();
    }

    async getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class MailUpdatePage {
    pageTitle = element(by.id('jhi-mail-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    fromInput = element(by.id('field_from'));
    toInput = element(by.id('field_to'));
    subjectInput = element(by.id('field_subject'));
    contentInput = element(by.id('field_content'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setFromInput(from) {
        await this.fromInput.sendKeys(from);
    }

    async getFromInput() {
        return this.fromInput.getAttribute('value');
    }

    async setToInput(to) {
        await this.toInput.sendKeys(to);
    }

    async getToInput() {
        return this.toInput.getAttribute('value');
    }

    async setSubjectInput(subject) {
        await this.subjectInput.sendKeys(subject);
    }

    async getSubjectInput() {
        return this.subjectInput.getAttribute('value');
    }

    async setContentInput(content) {
        await this.contentInput.sendKeys(content);
    }

    async getContentInput() {
        return this.contentInput.getAttribute('value');
    }

    async save() {
        await this.saveButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }

    getSaveButton(): ElementFinder {
        return this.saveButton;
    }
}

export class MailDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-mail-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-mail'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
