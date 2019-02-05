package com.dmk.web.rest;

import com.dmk.DmkApp;

import com.dmk.domain.Faq;
import com.dmk.repository.FaqRepository;
import com.dmk.service.FaqService;
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
 * Test class for the FaqResource REST controller.
 *
 * @see FaqResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = DmkApp.class)
public class FaqResourceIntTest {

    private static final String DEFAULT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_TEXT = "BBBBBBBBBB";

    @Autowired
    private FaqRepository faqRepository;

    @Autowired
    private FaqService faqService;

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

    private MockMvc restFaqMockMvc;

    private Faq faq;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final FaqResource faqResource = new FaqResource(faqService);
        this.restFaqMockMvc = MockMvcBuilders.standaloneSetup(faqResource)
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
    public static Faq createEntity(EntityManager em) {
        Faq faq = new Faq()
            .text(DEFAULT_TEXT);
        return faq;
    }

    @Before
    public void initTest() {
        faq = createEntity(em);
    }

    @Test
    @Transactional
    public void createFaq() throws Exception {
        int databaseSizeBeforeCreate = faqRepository.findAll().size();

        // Create the Faq
        restFaqMockMvc.perform(post("/api/faqs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(faq)))
            .andExpect(status().isCreated());

        // Validate the Faq in the database
        List<Faq> faqList = faqRepository.findAll();
        assertThat(faqList).hasSize(databaseSizeBeforeCreate + 1);
        Faq testFaq = faqList.get(faqList.size() - 1);
        assertThat(testFaq.getText()).isEqualTo(DEFAULT_TEXT);
    }

    @Test
    @Transactional
    public void createFaqWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = faqRepository.findAll().size();

        // Create the Faq with an existing ID
        faq.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restFaqMockMvc.perform(post("/api/faqs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(faq)))
            .andExpect(status().isBadRequest());

        // Validate the Faq in the database
        List<Faq> faqList = faqRepository.findAll();
        assertThat(faqList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllFaqs() throws Exception {
        // Initialize the database
        faqRepository.saveAndFlush(faq);

        // Get all the faqList
        restFaqMockMvc.perform(get("/api/faqs?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(faq.getId().intValue())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT.toString())));
    }
    
    @Test
    @Transactional
    public void getFaq() throws Exception {
        // Initialize the database
        faqRepository.saveAndFlush(faq);

        // Get the faq
        restFaqMockMvc.perform(get("/api/faqs/{id}", faq.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(faq.getId().intValue()))
            .andExpect(jsonPath("$.text").value(DEFAULT_TEXT.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingFaq() throws Exception {
        // Get the faq
        restFaqMockMvc.perform(get("/api/faqs/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateFaq() throws Exception {
        // Initialize the database
        faqService.save(faq);

        int databaseSizeBeforeUpdate = faqRepository.findAll().size();

        // Update the faq
        Faq updatedFaq = faqRepository.findById(faq.getId()).get();
        // Disconnect from session so that the updates on updatedFaq are not directly saved in db
        em.detach(updatedFaq);
        updatedFaq
            .text(UPDATED_TEXT);

        restFaqMockMvc.perform(put("/api/faqs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedFaq)))
            .andExpect(status().isOk());

        // Validate the Faq in the database
        List<Faq> faqList = faqRepository.findAll();
        assertThat(faqList).hasSize(databaseSizeBeforeUpdate);
        Faq testFaq = faqList.get(faqList.size() - 1);
        assertThat(testFaq.getText()).isEqualTo(UPDATED_TEXT);
    }

    @Test
    @Transactional
    public void updateNonExistingFaq() throws Exception {
        int databaseSizeBeforeUpdate = faqRepository.findAll().size();

        // Create the Faq

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFaqMockMvc.perform(put("/api/faqs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(faq)))
            .andExpect(status().isBadRequest());

        // Validate the Faq in the database
        List<Faq> faqList = faqRepository.findAll();
        assertThat(faqList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteFaq() throws Exception {
        // Initialize the database
        faqService.save(faq);

        int databaseSizeBeforeDelete = faqRepository.findAll().size();

        // Get the faq
        restFaqMockMvc.perform(delete("/api/faqs/{id}", faq.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Faq> faqList = faqRepository.findAll();
        assertThat(faqList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Faq.class);
        Faq faq1 = new Faq();
        faq1.setId(1L);
        Faq faq2 = new Faq();
        faq2.setId(faq1.getId());
        assertThat(faq1).isEqualTo(faq2);
        faq2.setId(2L);
        assertThat(faq1).isNotEqualTo(faq2);
        faq1.setId(null);
        assertThat(faq1).isNotEqualTo(faq2);
    }
}
