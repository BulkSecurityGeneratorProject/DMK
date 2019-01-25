/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { MailTaskComponentsPage, MailTaskDeleteDialog, MailTaskUpdatePage } from './mail-task.page-object';

const expect = chai.expect;

describe('MailTask e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let mailTaskUpdatePage: MailTaskUpdatePage;
    let mailTaskComponentsPage: MailTaskComponentsPage;
    let mailTaskDeleteDialog: MailTaskDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load MailTasks', async () => {
        await navBarPage.goToEntity('mail-task');
        mailTaskComponentsPage = new MailTaskComponentsPage();
        expect(await mailTaskComponentsPage.getTitle()).to.eq('dmkApp.mailTask.home.title');
    });

    it('should load create MailTask page', async () => {
        await mailTaskComponentsPage.clickOnCreateButton();
        mailTaskUpdatePage = new MailTaskUpdatePage();
        expect(await mailTaskUpdatePage.getPageTitle()).to.eq('dmkApp.mailTask.home.createOrEditLabel');
        await mailTaskUpdatePage.cancel();
    });

    it('should create and save MailTasks', async () => {
        const nbButtonsBeforeCreate = await mailTaskComponentsPage.countDeleteButtons();

        await mailTaskComponentsPage.clickOnCreateButton();
        await promise.all([
            mailTaskUpdatePage.setMailIdInput('5'),
            mailTaskUpdatePage.setStatusInput('status'),
            mailTaskUpdatePage.setLastUpdateInput('2000-12-31')
        ]);
        expect(await mailTaskUpdatePage.getMailIdInput()).to.eq('5');
        expect(await mailTaskUpdatePage.getStatusInput()).to.eq('status');
        expect(await mailTaskUpdatePage.getLastUpdateInput()).to.eq('2000-12-31');
        await mailTaskUpdatePage.save();
        expect(await mailTaskUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await mailTaskComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last MailTask', async () => {
        const nbButtonsBeforeDelete = await mailTaskComponentsPage.countDeleteButtons();
        await mailTaskComponentsPage.clickOnLastDeleteButton();

        mailTaskDeleteDialog = new MailTaskDeleteDialog();
        expect(await mailTaskDeleteDialog.getDialogTitle()).to.eq('dmkApp.mailTask.delete.question');
        await mailTaskDeleteDialog.clickOnConfirmButton();

        expect(await mailTaskComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
