import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import propOr from '@tinkoff/utils/object/propOr';

import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs.jsx';
import DeliveryOffer from '../../components/DeliveryOffer/DeliveryOffer.jsx';

import styles from './Contacts.css';
import mapStyles from './map';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap
    };
};

const COORDS_MARKER = [50.42812164667449, 30.357138111679724];
let directionsRenderer;
let directionsService;

class Contacts extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired
    };

    state = {
        latitude: COORDS_MARKER[0],
        longitude: COORDS_MARKER[1]
    };

    componentDidMount () {
        this.setMap();
    }

    setMap () {
        directionsRenderer = new window.google.maps.DirectionsRenderer({ suppressMarkers: true, polylineOptions: { strokeColor: '#000000', strokeWeight: 8 } });
        directionsService = new window.google.maps.DirectionsService();
        const mapOptions = {
            zoom: 17,
            center: new window.google.maps.LatLng(50.42922841856509, 30.359888593853466),
            styles: mapStyles,
            fullscreenControl: false,
            mapTypeControl: false
        };
        const map = new window.google.maps.Map(document.getElementById('map'), mapOptions);
        directionsRenderer.setMap(map);
        const marker = new window.google.maps.Marker({
            position: { lat: COORDS_MARKER[0], lng: COORDS_MARKER[1] },
            icon: {
                url: '/src/apps/client/ui/pages/Contacts/img/placemark.png'
            }
        });

        marker.setMap(map);
    }

    getDirections = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    this.setState({
                        latitude,
                        longitude
                    }, () => this.calculateAndDisplayRoute(directionsService, directionsRenderer));
                },
                () => {
                    const win = window.open('https://goo.gl/maps/ZNRRN7CZHSguhPDi6', '_blank');
                    win.focus();
                });
        } else {
            const win = window.open('https://goo.gl/maps/ZNRRN7CZHSguhPDi6', '_blank');
            win.focus();
        }
    };

    calculateAndDisplayRoute = (directionsService, directionsRenderer) => {
        const { latitude, longitude } = this.state;
        const origin = { lat: latitude, lng: longitude };
        directionsService.route({
            origin,
            destination: { lat: COORDS_MARKER[0], lng: COORDS_MARKER[1] },
            travelMode: 'DRIVING'
        }, function (response, status) {
            if (status === 'OK') {
                directionsRenderer.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    };

    render () {
        const { langMap } = this.props;
        const text = propOr('contacts', {}, langMap);

        return (
            <section className={styles.contacts}>
                <Breadcrumbs noCategoryPage={text.title}/>
                <DeliveryOffer mobile/>
                <div className={styles.contactsContainer}>
                    <h1 className={styles.title}>{text.title}</h1>
                    <div className={styles.info}>
                        <div className={styles.phonesContainer}>
                            <h2 className={styles.infoTitle}>{text.phonesTitle}</h2>
                            <a className={styles.infoText} href="tel:+380443557720">(044) 355-77-20</a>
                            <a className={styles.infoText} href="tel:+380679000522">(067) 900-05-22</a>
                        </div>
                        <div className={styles.emailScheduleContainer}>
                            <div className={styles.emailContainer}>
                                <h2 className={styles.infoTitle}>{text.emailTitle}</h2>
                                <a className={styles.infoText} href="mailto:mebelmarket@gmail.com">mebelmarket@gmail.com</a>
                            </div>
                            <div className={styles.scheduleContainer}>
                                <h2 className={styles.infoTitle}>{text.scheduleTitle}</h2>
                                <p className={styles.infoText}>{text.scheduleDays} 10:00 - 19:00</p>
                            </div>
                        </div>
                        <div className={styles.addressContainer}>
                            <h2 className={styles.infoTitle}>{text.addressTitle}</h2>
                            <p className={styles.infoText}>{text.addressText}</p>
                        </div>
                    </div>
                    <div className={styles.mapContainer}>
                        <button className={styles.getDirectionsBtn} onClick={this.getDirections}>
                            {text.getDirectionsBtn}
                        </button>
                        <div className={styles.map} id='map'/>
                    </div>
                </div>
            </section>
        );
    }
}

export default connect(mapStateToProps)(Contacts);
