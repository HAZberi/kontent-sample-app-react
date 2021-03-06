import { Client } from '../Client.js';
import {
  initLanguageCodeObject,
  defaultLanguage
} from '../Utilities/LanguageCodes';
import { spinnerService } from '@simply007org/react-spinners';

let changeListeners = [];
const resetStore = () => ({
  facts: initLanguageCodeObject(),
  metaData: initLanguageCodeObject()
});
let { facts, metaData } = resetStore();

let notifyChange = () => {
  changeListeners.forEach(listener => {
    listener();
  });
};

let fetchFacts = (language, urlSlug) => {
  let query = Client.items()
    .type('about_us')
    .elementsParameter([
      'facts',
      'modular_content',
      'title',
      'description',
      'image'
    ]);

  if (language) {
    query.languageParameter(language);
  }

  if (urlSlug) {
    query.equalsFilter('elements.url_pattern', urlSlug);
  }

  query
    .toPromise()
    .then(response => {
      if (language) {
        facts[language] = response.data.items[0].elements.facts;
      } else {
        facts[defaultLanguage] = response.data.items[0].elements.facts;
      }
      notifyChange();
    });
};

let fetchMetaData = (language, urlSlug) => {
  let query = Client.items()
    .type('about_us')
    .elementsParameter([
      'metadata__meta_title',
      'metadata__meta_description',
      'metadata__og_title',
      'metadata__og_description',
      'metadata__og_image',
      'metadata__twitter_title',
      'metadata__twitter_site',
      'metadata__twitter_creator',
      'metadata__twitter_description',
      'metadata__twitter_image'
    ]);

  if (language) {
    query.languageParameter(language);
  }

  if (urlSlug) {
    query.equalsFilter('elements.url_pattern', urlSlug);
  }

  query
    .toPromise()
    .then(response => {
      if (language) {
        metaData[language] = response.data.items[0];
      } else {
        metaData[defaultLanguage] = response.data.items[0];
      }
      notifyChange();
    });
};

class About {
  // Actions

  provideFacts(language, urlSlug) {
    if (spinnerService.isShowing('apiSpinner') === false) {
      spinnerService.show('apiSpinner');
    }
    fetchFacts(language, urlSlug);
  }

  provideMetaData(language, urlSlug) {
    if (spinnerService.isShowing('apiSpinner') === false) {
      spinnerService.show('apiSpinner');
    }
    fetchMetaData(language, urlSlug);
  }

  // Methods

  getFacts(language) {
    spinnerService.hide('apiSpinner');
    return facts[language];
  }

  getMetaData(language) {
    spinnerService.hide('apiSpinner');
    return metaData[language];
  }

  // Listeners

  addChangeListener(listener) {
    changeListeners.push(listener);
  }

  removeChangeListener(listener) {
    changeListeners = changeListeners.filter(element => {
      return element !== listener;
    });
  }
}

let AboutStore = new About();

export { AboutStore, resetStore };
