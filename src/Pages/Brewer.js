import React, { Component } from 'react';
import { BrewerStore } from '../Stores/Brewer';
import RichText from '../Components/RichText';
import Metadata from '../Components/Metadata';
import { translate } from 'react-translate';

let getState = props => {
  return {
    brewer: BrewerStore.getBrewer(
      props.match.params.brewerSlug,
      props.language
    ),
    match: { params: { brewerSlug: props.match.params.brewerSlug } }
  };
};

class Brewer extends Component {
  constructor(props) {
    super(props);

    this.state = getState(props);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    BrewerStore.addChangeListener(this.onChange);
    BrewerStore.provideBrewer(this.props.language);
  }

  componentWillUnmount() {
    BrewerStore.removeChangeListener(this.onChange);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      prevState.language !== nextProps.language ||
      prevState.match.params.brewerSlug !== nextProps.match.params.brewerSlug
    ) {
      BrewerStore.provideBrewers(nextProps.language);
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
    if (!this.state.brewer) {
      return <div className="container" />;
    }

    let brewer = this.state.brewer;
    let name =
      brewer.elements.productName.value.trim().length > 0
        ? brewer.elements.productName.value
        : this.props.t('noNameValue');

    let imageLink =
      brewer.elements.image.value[0] !== undefined ? (
        <img alt={name} src={brewer.elements.image.value[0].url} title={name} />
      ) : (
        <div className="placeholder-tile-image">
          {this.props.t('noTeaserValue')}
        </div>
      );

    let descriptionElement =
      brewer.elements.longDescription.value !== '<p><br></p>' ? (
        <RichText element={brewer.elements.longDescription} />
      ) : (
        <p>{this.props.t('noDescriptionValue')}</p>
      );

    return (
      <div className="container">
        <Metadata
          title={brewer.elements.metadataMetaTitle}
          description={brewer.elements.metadataMetaDescription}
          ogTitle={brewer.elements.metadataOgTitle}
          ogImage={brewer.elements.metadataOgImage}
          ogDescription={brewer.elements.metadataOgDescription}
          twitterTitle={brewer.elements.metadataMetaTitle}
          twitterSite={brewer.elements.metadataTwitterSite}
          twitterCreator={brewer.elements.metadataTwitterCreator}
          twitterDescription={brewer.elements.metadataTwitterDescription}
          twitterImage={brewer.elements.metadataTwitterImage}
        />
        <article className="product-detail">
          <div className="row">
            <div className="col-md-12">
              <header>
                <h2>{name}</h2>
              </header>
            </div>
          </div>
          <div className="row-fluid">
            <div className="col-lg-7 col-md-6">
              <figure className="image">{imageLink}</figure>
              <div className="description">{descriptionElement}</div>
            </div>
          </div>
        </article>
      </div>
    );
  }
}

export default translate('Brewers')(Brewer);
