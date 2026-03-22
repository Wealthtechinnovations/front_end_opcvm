/**
 * Schema.org structured data generators for OPCVM pages
 */

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Fundafrique',
  description: 'Plateforme d\'analyse et de sélection des OPCVM Africains',
  url: 'https://fundafrique.com',
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Fundafrique',
  url: 'https://fundafrique.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://fundafrique.com/Opcvm/recherche?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export const fundSchema = (fund) => ({
  '@context': 'https://schema.org',
  '@type': 'FinancialProduct',
  name: fund.nom_fond || fund.libelle_fond || fund.nom || fund.name,
  description: `Fond d'investissement OPCVM - ${fund.categorie || fund.category || fund.classification || ''}`,
  provider: {
    '@type': 'Organization',
    name: fund.societe_gestion || fund.societe || fund.company || '',
  },
  ...(fund.devise && { priceCurrency: fund.devise }),
  ...(fund.code_ISIN && { identifier: fund.code_ISIN }),
  ...(fund.pays && { areaServed: fund.pays }),
});

export const breadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    ...(item.url && { item: item.url }),
  })),
});

export const articleSchema = (article) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.titre || article.title,
  datePublished: article.date,
  author: {
    '@type': 'Organization',
    name: 'Fundafrique',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Fundafrique',
  },
});

export const faqSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});
