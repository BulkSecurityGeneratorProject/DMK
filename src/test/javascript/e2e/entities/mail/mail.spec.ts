/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { MailComponentsPage, MailDeleteDialog, MailUpdatePage } from './mail.page-object';

const expect = chai.expect;

describe('Mail e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let mailUpdatePage: MailUpdatePage;
    let mailComponentsPage: MailComponentsPage;
    let mailDeleteDialog: MailDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Mail', async () => {
        await navBarPage.goToEntity('mail');
        mailComponentsPage = new MailComponentsPage();
        expect(await mailComponentsPage.getTitle()).to.eq('dmkApp.mail.home.title');
    });

    it('should load create Mail page', async () => {
        await mailComponentsPage.clickOnCreateButton();
        mailUpdatePage = new MailUpdatePage();
        expect(await mailUpdatePage.getPageTitle()).to.eq('dmkApp.mail.home.createOrEditLabel');
        await mailUpdatePage.cancel();
    });

    it('should create and save Mail', async () => {
        const nbButtonsBeforeCreate = await mailComponentsPage.countDeleteButtons();

        await mailComponentsPage.clickOnCreateButton();
        await promise.all([
            mailUpdatePage.setFromInput('from'),
            mailUpdatePage.setToInput('to'),
            mailUpdatePage.setSubjectInput('subject'),
            mailUpdatePage.setContentInput('content')
        ]);
        expect(await mailUpdatePage.getFromInput()).to.eq('from');
        expect(await mailUpdatePage.getToInput()).to.eq('to');
        expect(await mailUpdatePage.getSubjectInput()).to.eq('subject');
        expect(await mailUpdatePage.getContentInput()).to.eq('content');
        await mailUpdatePage.save();
        expect(await mailUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await mailComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last Mail', async () => {
        const nbButtonsBeforeDelete = await mailComponentsPage.countDeleteButtons();
        await mailComponentsPage.clickOnLastDeleteButton();

        mailDeleteDialog = new MailDeleteDialog();
        expect(await mailDeleteDialog.getDialogTitle()).to.eq('dmkApp.mail.delete.question');
        await mailDeleteDialog.clickOnConfirmButton();

        expect(await mailComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
