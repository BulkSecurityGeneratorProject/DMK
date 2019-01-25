package com.dmk.web.rest;

import com.dmk.DmkApp;

import com.dmk.domain.MailTask;
import com.dmk.repository.MailTaskRepository;
import com.dmk.service.MailTaskService;
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
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;


import static com.dmk.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the MailTaskResource REST controller.
 *
 * @see MailTaskResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = DmkApp.class)
public class MailTaskResourceIntTest {

    private static final Long DEFAULT_MAIL_ID = 1L;
    private static final Long UPDATED_MAIL_ID = 2L;

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final Instant DEFAULT_LAST_UPDATE = Instant.EPOCH;
    private static final Instant UPDATED_LAST_UPDATE = Instant.now();

    @Autowired
    private MailTaskRepository mailTaskRepository;

    @Autowired
    private MailTaskService mailTaskService;

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

    private MockMvc restMailTaskMockMvc;

    private MailTask mailTask;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final MailTaskResource mailTaskResource = new MailTaskResource(mailTaskService);
        this.restMailTaskMockMvc = MockMvcBuilders.standaloneSetup(mailTaskResource)
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
    public static MailTask createEntity(EntityManager em) {
        MailTask mailTask = new MailTask()
            .mailId(DEFAULT_MAIL_ID)
            .status(DEFAULT_STATUS)
            .lastUpdate(DEFAULT_LAST_UPDATE);
        return mailTask;
    }

    @Before
    public void initTest() {
        mailTask = createEntity(em);
    }

    @Test
    @Transactional
    public void createMailTask() throws Exception {
        int databaseSizeBeforeCreate = mailTaskRepository.findAll().size();

        // Create the MailTask
        restMailTaskMockMvc.perform(post("/api/mail-tasks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(mailTask)))
            .andExpect(status().isCreated());

        // Validate the MailTask in the database
        List<MailTask> mailTaskList = mailTaskRepository.findAll();
        assertThat(mailTaskList).hasSize(databaseSizeBeforeCreate + 1);
        MailTask testMailTask = mailTaskList.get(mailTaskList.size() - 1);
        assertThat(testMailTask.getMailId()).isEqualTo(DEFAULT_MAIL_ID);
        assertThat(testMailTask.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testMailTask.getLastUpdate()).isEqualTo(DEFAULT_LAST_UPDATE);
    }

    @Test
    @Transactional
    public void createMailTaskWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = mailTaskRepository.findAll().size();

        // Create the MailTask with an existing ID
        mailTask.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restMailTaskMockMvc.perform(post("/api/mail-tasks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(mailTask)))
            .andExpect(status().isBadRequest());

        // Validate the MailTask in the database
        List<MailTask> mailTaskList = mailTaskRepository.findAll();
        assertThat(mailTaskList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllMailTasks() throws Exception {
        // Initialize the database
        mailTaskRepository.saveAndFlush(mailTask);

        // Get all the mailTaskList
        restMailTaskMockMvc.perform(get("/api/mail-tasks?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(mailTask.getId().intValue())))
            .andExpect(jsonPath("$.[*].mailId").value(hasItem(DEFAULT_MAIL_ID.intValue())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].lastUpdate").value(hasItem(DEFAULT_LAST_UPDATE.toString())));
    }
    
    @Test
    @Transactional
    public void getMailTask() throws Exception {
        // Initialize the database
        mailTaskRepository.saveAndFlush(mailTask);

        // Get the mailTask
        restMailTaskMockMvc.perform(get("/api/mail-tasks/{id}", mailTask.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(mailTask.getId().intValue()))
            .andExpect(jsonPath("$.mailId").value(DEFAULT_MAIL_ID.intValue()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.lastUpdate").value(DEFAULT_LAST_UPDATE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingMailTask() throws Exception {
        // Get the mailTask
        restMailTaskMockMvc.perform(get("/api/mail-tasks/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMailTask() throws Exception {
        // Initialize the database
        mailTaskService.save(mailTask);

        int databaseSizeBeforeUpdate = mailTaskRepository.findAll().size();

        // Update the mailTask
        MailTask updatedMailTask = mailTaskRepository.findById(mailTask.getId()).get();
        // Disconnect from session so that the updates on updatedMailTask are not directly saved in db
        em.detach(updatedMailTask);
        updatedMailTask
            .mailId(UPDATED_MAIL_ID)
            .status(UPDATED_STATUS)
            .lastUpdate(UPDATED_LAST_UPDATE);

        restMailTaskMockMvc.perform(put("/api/mail-tasks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedMailTask)))
            .andExpect(status().isOk());

        // Validate the MailTask in the database
        List<MailTask> mailTaskList = mailTaskRepository.findAll();
        assertThat(mailTaskList).hasSize(databaseSizeBeforeUpdate);
        MailTask testMailTask = mailTaskList.get(mailTaskList.size() - 1);
        assertThat(testMailTask.getMailId()).isEqualTo(UPDATED_MAIL_ID);
        assertThat(testMailTask.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testMailTask.getLastUpdate()).isEqualTo(UPDATED_LAST_UPDATE);
    }

    @Test
    @Transactional
    public void updateNonExistingMailTask() throws Exception {
        int databaseSizeBeforeUpdate = mailTaskRepository.findAll().size();

        // Create the MailTask

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMailTaskMockMvc.perform(put("/api/mail-tasks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(mailTask)))
            .andExpect(status().isBadRequest());

        // Validate the MailTask in the database
        List<MailTask> mailTaskList = mailTaskRepository.findAll();
        assertThat(mailTaskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteMailTask() throws Exception {
        // Initialize the database
        mailTaskService.save(mailTask);

        int databaseSizeBeforeDelete = mailTaskRepository.findAll().size();

        // Get the mailTask
        restMailTaskMockMvc.perform(delete("/api/mail-tasks/{id}", mailTask.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<MailTask> mailTaskList = mailTaskRepository.findAll();
        assertThat(mailTaskList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MailTask.class);
        MailTask mailTask1 = new MailTask();
        mailTask1.setId(1L);
        MailTask mailTask2 = new MailTask();
        mailTask2.setId(mailTask1.getId());
        assertThat(mailTask1).isEqualTo(mailTask2);
        mailTask2.setId(2L);
        assertThat(mailTask1).isNotEqualTo(mailTask2);
        mailTask1.setId(null);
        assertThat(mailTask1).isNotEqualTo(mailTask2);
    }
}
