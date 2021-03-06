import React, { Component } from 'react';
import { AboutStore } from '../Stores/About';
import RichText from '../Components/RichText';
import Metadata from '../Components/Metadata';
import { translate } from 'react-translate';

let getState = props => {
  return {
    metaData: AboutStore.getMetaData(props.language),
    facts: AboutStore.getFacts(props.language)
  };
};

class About extends Component {
  constructor(props) {
    super(props);

    this.state = getState(props);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    AboutStore.addChangeListener(this.onChange);
    AboutStore.provideFacts(
      this.props.language,
      this.props.match.params.urlSlug
    );
    AboutStore.provideMetaData(
      this.props.language,
      this.props.match.params.urlSlug
    );
  }

  componentWillUnmount() {
    AboutStore.removeChangeListener(this.onChange);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.language !== nextProps.language) {
      AboutStore.provideFacts(
        nextProps.language,
        nextProps.match.params.urlSlug
      );
      AboutStore.provideMetaData(
        nextProps.language,
        nextProps.match.params.urlSlug
      );
      return {
        language: nextProps.language
      };
    }
    return null;
  }

  onChange() {
    this.setState(getState(this.props));
  }

  render() {
    let facts =
      this.state.facts.linkedItems &&
      this.state.facts.linkedItems.map((fact, index) => {
        let title =
          fact.elements.title.value.trim().length > 0
            ? fact.elements.title.value
            : this.props.t('noTitleValue');

        let descriptionElement =
          fact.elements.description.value !== '<p><br></p>' ? (
            <RichText
              className="text-and-image-text"
              element={fact.elements.description}
            />
          ) : (
            <p className="text-and-image-text">
              {this.props.t('noDescriptionValue')}
            </p>
          );

        let imageLink =
          fact.elements.image.value[0] !== undefined ? (
            <img
              alt={title}
              className="img-responsive"
              src={fact.elements.image.value[0].url}
              title={title}
            />
          ) : (
            <div className="img-responsive placeholder-tile-image">
              {this.props.t('noTeaserValue')}
            </div>
          );

        if (index % 2 === 0) {
          return (
            <section className="row text-and-image" key={index}>
              <h2 className="col-lg-12">{title}</h2>
              <div className="col-md-6">{descriptionElement}</div>
              <div className="col-md-6">{imageLink}</div>
            </section>
          );
        }

        return (
          <section className="row text-and-image" key={index}>
            <h2 className="col-lg-12">{title}</h2>
            <div className="col-md-6 col-md-push-6">{descriptionElement}</div>
            <div className="col-md-6 col-md-pull-6">{imageLink}</div>
          </section>
        );
      });

    let metaDataElements = this.state.metaData.elements || {};

    return (
      <div className="container">
        <Metadata
          title={metaDataElements.metadataMetaTitle}
          description={metaDataElements.metadataMetaDescription}
          ogTitle={metaDataElements.metadataOgTitle}
          ogImage={metaDataElements.metadataOgImage}
          ogDescription={metaDataElements.metadataOgDescription}
          twitterTitle={metaDataElements.metadataMetaTitle}
          twitterSite={metaDataElements.metadataTwitterSite}
          twitterCreator={metaDataElements.metadataTwitterCreator}
          twitterDescription={metaDataElements.metadataTwitterDescription}
          twitterImage={metaDataElements.metadataTwitterImage}
        />
        {facts}
      </div>
    );
  }
}

export default translate('About')(About);
