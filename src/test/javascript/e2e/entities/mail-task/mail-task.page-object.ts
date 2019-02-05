import { element, by, ElementFinder } from 'protractor';

export class MailTaskComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-mail-task div table .btn-danger'));
    title = element.all(by.css('jhi-mail-task div h2#page-heading span')).first();

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

export class MailTaskUpdatePage {
    pageTitle = element(by.id('jhi-mail-task-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    mailIdInput = element(by.id('field_mailId'));
    statusInput = element(by.id('field_status'));
    lastUpdateInput = element(by.id('field_lastUpdate'));
    createdDateInput = element(by.id('field_createdDate'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setMailIdInput(mailId) {
        await this.mailIdInput.sendKeys(mailId);
    }

    async getMailIdInput() {
        return this.mailIdInput.getAttribute('value');
    }

    async setStatusInput(status) {
        await this.statusInput.sendKeys(status);
    }

    async getStatusInput() {
        return this.statusInput.getAttribute('value');
    }

    async setLastUpdateInput(lastUpdate) {
        await this.lastUpdateInput.sendKeys(lastUpdate);
    }

    async getLastUpdateInput() {
        return this.lastUpdateInput.getAttribute('value');
    }

    async setCreatedDateInput(createdDate) {
        await this.createdDateInput.sendKeys(createdDate);
    }

    async getCreatedDateInput() {
        return this.createdDateInput.getAttribute('value');
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

export class MailTaskDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-mailTask-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-mailTask'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
