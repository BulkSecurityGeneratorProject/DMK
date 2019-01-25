/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { FaqComponentsPage, FaqDeleteDialog, FaqUpdatePage } from './faq.page-object';

const expect = chai.expect;

describe('Faq e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let faqUpdatePage: FaqUpdatePage;
    let faqComponentsPage: FaqComponentsPage;
    let faqDeleteDialog: FaqDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Faqs', async () => {
        await navBarPage.goToEntity('faq');
        faqComponentsPage = new FaqComponentsPage();
        expect(await faqComponentsPage.getTitle()).to.eq('dmkApp.faq.home.title');
    });

    it('should load create Faq page', async () => {
        await faqComponentsPage.clickOnCreateButton();
        faqUpdatePage = new FaqUpdatePage();
        expect(await faqUpdatePage.getPageTitle()).to.eq('dmkApp.faq.home.createOrEditLabel');
        await faqUpdatePage.cancel();
    });

    it('should create and save Faqs', async () => {
        const nbButtonsBeforeCreate = await faqComponentsPage.countDeleteButtons();

        await faqComponentsPage.clickOnCreateButton();
        await promise.all([faqUpdatePage.setTextInput('text')]);
        expect(await faqUpdatePage.getTextInput()).to.eq('text');
        await faqUpdatePage.save();
        expect(await faqUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await faqComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last Faq', async () => {
        const nbButtonsBeforeDelete = await faqComponentsPage.countDeleteButtons();
        await faqComponentsPage.clickOnLastDeleteButton();

        faqDeleteDialog = new FaqDeleteDialog();
        expect(await faqDeleteDialog.getDialogTitle()).to.eq('dmkApp.faq.delete.question');
        await faqDeleteDialog.clickOnConfirmButton();

        expect(await faqComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
