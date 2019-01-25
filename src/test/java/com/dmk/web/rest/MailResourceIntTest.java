package com.dmk.web.rest;

import com.dmk.DmkApp;

import com.dmk.domain.Mail;
import com.dmk.repository.MailRepository;
import com.dmk.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.List;


import static com.dmk.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the MailResource REST controller.
 *
 * @see MailResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = DmkApp.class)
public class MailResourceIntTest {

    private static final String DEFAULT_FROM = "AAAAAAAAAA";
    private static final String UPDATED_FROM = "BBBBBBBBBB";

    private static final String DEFAULT_TO = "AAAAAAAAAA";
    private static final String UPDATED_TO = "BBBBBBBBBB";

    private static final String DEFAULT_SUBJECT = "AAAAAAAAAA";
    private static final String UPDATED_SUBJECT = "BBBBBBBBBB";

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    @Autowired
    private MailRepository mailRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

//    @Autowired
//    private Validator validator;

    private MockMvc restMailMockMvc;

    private Mail mail;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final MailResource mailResource = new MailResource(mailRepository);
        this.restMailMockMvc = MockMvcBuilders.standaloneSetup(mailResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
//            .setValidator(validator)
            .build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Mail createEntity(EntityManager em) {
        Mail mail = new Mail()
            .from(DEFAULT_FROM)
            .to(DEFAULT_TO)
            .subject(DEFAULT_SUBJECT)
            .content(DEFAULT_CONTENT);
        return mail;
    }

    @Before
    public void initTest() {
        mail = createEntity(em);
    }

    @Test
    @Transactional
    public void createMail() throws Exception {
        int databaseSizeBeforeCreate = mailRepository.findAll().size();

        // Create the Mail
        restMailMockMvc.perform(post("/api/mail")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(mail)))
            .andExpect(status().isCreated());

        // Validate the Mail in the database
        List<Mail> mailList = mailRepository.findAll();
        assertThat(mailList).hasSize(databaseSizeBeforeCreate + 1);
        Mail testMail = mailList.get(mailList.size() - 1);
        assertThat(testMail.getFrom()).isEqualTo(DEFAULT_FROM);
        assertThat(testMail.getTo()).isEqualTo(DEFAULT_TO);
        assertThat(testMail.getSubject()).isEqualTo(DEFAULT_SUBJECT);
        assertThat(testMail.getContent()).isEqualTo(DEFAULT_CONTENT);
    }

    @Test
    @Transactional
    public void createMailWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = mailRepository.findAll().size();

        // Create the Mail with an existing ID
        mail.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restMailMockMvc.perform(post("/api/mail")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(mail)))
            .andExpect(status().isBadRequest());

        // Validate the Mail in the database
        List<Mail> mailList = mailRepository.findAll();
        assertThat(mailList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllMail() throws Exception {
        // Initialize the database
        mailRepository.saveAndFlush(mail);

        // Get all the mailList
        restMailMockMvc.perform(get("/api/mail?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(mail.getId().intValue())))
            .andExpect(jsonPath("$.[*].from").value(hasItem(DEFAULT_FROM.toString())))
            .andExpect(jsonPath("$.[*].to").value(hasItem(DEFAULT_TO.toString())))
            .andExpect(jsonPath("$.[*].subject").value(hasItem(DEFAULT_SUBJECT.toString())))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT.toString())));
    }
    
    @Test
    @Transactional
    public void getMail() throws Exception {
        // Initialize the database
        mailRepository.saveAndFlush(mail);

        // Get the mail
        restMailMockMvc.perform(get("/api/mail/{id}", mail.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(mail.getId().intValue()))
            .andExpect(jsonPath("$.from").value(DEFAULT_FROM.toString()))
            .andExpect(jsonPath("$.to").value(DEFAULT_TO.toString()))
            .andExpect(jsonPath("$.subject").value(DEFAULT_SUBJECT.toString()))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingMail() throws Exception {
        // Get the mail
        restMailMockMvc.perform(get("/api/mail/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMail() throws Exception {
        // Initialize the database
        mailRepository.saveAndFlush(mail);

        int databaseSizeBeforeUpdate = mailRepository.findAll().size();

        // Update the mail
        Mail updatedMail = mailRepository.findById(mail.getId()).get();
        // Disconnect from session so that the updates on updatedMail are not directly saved in db
        em.detach(updatedMail);
        updatedMail
            .from(UPDATED_FROM)
            .to(UPDATED_TO)
            .subject(UPDATED_SUBJECT)
            .content(UPDATED_CONTENT);

        restMailMockMvc.perform(put("/api/mail")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedMail)))
            .andExpect(status().isOk());

        // Validate the Mail in the database
        List<Mail> mailList = mailRepository.findAll();
        assertThat(mailList).hasSize(databaseSizeBeforeUpdate);
        Mail testMail = mailList.get(mailList.size() - 1);
        assertThat(testMail.getFrom()).isEqualTo(UPDATED_FROM);
        assertThat(testMail.getTo()).isEqualTo(UPDATED_TO);
        assertThat(testMail.getSubject()).isEqualTo(UPDATED_SUBJECT);
        assertThat(testMail.getContent()).isEqualTo(UPDATED_CONTENT);
    }

    @Test
    @Transactional
    public void updateNonExistingMail() throws Exception {
        int databaseSizeBeforeUpdate = mailRepository.findAll().size();

        // Create the Mail

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMailMockMvc.perform(put("/api/mail")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(mail)))
            .andExpect(status().isBadRequest());

        // Validate the Mail in the database
        List<Mail> mailList = mailRepository.findAll();
        assertThat(mailList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteMail() throws Exception {
        // Initialize the database
        mailRepository.saveAndFlush(mail);

        int databaseSizeBeforeDelete = mailRepository.findAll().size();

        // Get the mail
        restMailMockMvc.perform(delete("/api/mail/{id}", mail.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Mail> mailList = mailRepository.findAll();
        assertThat(mailList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Mail.class);
        Mail mail1 = new Mail();
        mail1.setId(1L);
        Mail mail2 = new Mail();
        mail2.setId(mail1.getId());
        assertThat(mail1).isEqualTo(mail2);
        mail2.setId(2L);
        assertThat(mail1).isNotEqualTo(mail2);
        mail1.setId(null);
        assertThat(mail1).isNotEqualTo(mail2);
    }
}
