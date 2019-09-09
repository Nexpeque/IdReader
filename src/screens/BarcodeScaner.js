import React, { Component } from 'react';
import { View, AppRegistry, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { db } from '../config';
export default class ScannerScene extends Component {
	constructor(props) {
		super(props);
		this.camera = null;
		this.barcodeCodes = [];

		this.state = {
			camera: {
				type: RNCamera.Constants.Type.back,
				orientation: RNCamera.Constants.Orientation.auto,
				flashMode: RNCamera.Constants.FlashMode.auto,
				barcodeFinderVisible: true
			}
		};
	}

	addItem = (id) => {
		db.ref('/ids').push({
			id: id
		});
	};

	handleAccept = (scanResult) => {
		var exists = false;
		db.ref('/ids').orderByChild('id').equalTo(scanResult).once('value', snapshot => {
			if (snapshot.exists()) {
				exists = true;
			}
		}).then(() => {
			if (!exists) {
				this.addItem(scanResult);
				Alert.alert('Id added successfully');
			} else {
				Alert.alert('Error', 'El id ya existe');
			}
		});
	}

	onBarCodeRead = (scanResult) => {
		var dataProcess = scanResult.barcodes[0].rawData.split('\u0000');
		console.log(dataProcess);
		var filtered = dataProcess.filter(function (value, index, arr) {
			return value != "";
		});
		console.log(filtered);

		var result = filtered[3].match(/\d+/g);
		console.log(result[0]);
		Alert.alert(
			`¿Deseas agregar el id?`,
			`${scanResult.type}`,
			[
				{
					text: 'Cancelar',
					onPress: () => { },
					style: 'cancel',
				},
				{ text: 'OK', onPress: () => this.handleAccept(result[0]) },
			],
			{ cancelable: false },
		);
	}

	render() {
		const styles = this.defaultStyles();
		return (
			<View style={styles.container}>
				<RNCamera
					ref={cam => {
						this.camera = cam;
					}}
					style={styles.preview}
					type={this.state.camera.type}
					flashMode={this.state.camera.flashMode}
					onFocusChanged={() => { }}
					onZoomChanged={() => { }}
					defaultTouchToFocus
					mirrorImage={false}
					barcodeFinderVisible={this.state.camera.barcodeFinderVisible}
					barcodeFinderWidth={280}
					barcodeFinderHeight={220}
					barcodeFinderBorderColor="red"
					barcodeFinderBorderWidth={2}
					onGoogleVisionBarcodesDetected={this.onBarCodeRead.bind(this)}
					googleVisionBarcodeType={RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType.PDF417}
					captureAudio={false}
				/>

			</View>
		);
	}
	defaultStyles() {
		return {
			container: {
				flex: 1
			},
			preview: {
				flex: 1,
				justifyContent: 'flex-end',
				alignItems: 'center'
			},
			overlay: {
				position: 'absolute',
				padding: 16,
				right: 0,
				left: 0,
				alignItems: 'center'
			},
			topOverlay: {
				top: 0,
				flex: 1,
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center'
			},
			bottomOverlay: {
				bottom: 0,
				backgroundColor: 'rgba(0,0,0,0.4)',
				flexDirection: 'row',
				justifyContent: 'center',
				alignItems: 'center'
			},
			enterBarcodeManualButton: {
				padding: 15,
				backgroundColor: 'white',
				borderRadius: 40
			},
			scanScreenMessage: {
				fontSize: 14,
				color: 'white',
				textAlign: 'center',
				alignItems: 'center',
				justifyContent: 'center'
			}
		};
	}
}

AppRegistry.registerComponent('barcode-reader', () => ScannerScene);