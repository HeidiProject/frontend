<template>
	<div class="info">
		<!--Caption-->
		<div
			class="caption-msg"
			v-bind:class="{
				'text-success': isValid,
				'alert-danger': !isValid
			}"
		>{{ captionMessage }}
		</div>

		<h5 v-show="(emptyDirectoryWarning)"> Our suggestions to make it better: </h5>

		<!--No directory suggestion-->
		<p v-show="(emptyDirectoryWarning)" class="suggestion"> <span> Some of <span class="bold">Directory</span> fields are left empty. </span>
			<ul>
				<li>We advise to specify desired directory structure for your data. It will greatly enhance your data collection experience.</li>
				<li>Specify relative directory, for instance <samp>20190901/PXI/my_xtal1</samp></li>
				<li>You can use macros, for instance <samp>{date}/{beamline}/{prefix}</samp></li>
				<li> see Docs tab for more details on the mandatory columns</li>
				<li>Full TELL spreadsheet instructions available at https://www.psi.ch/en/sls/pxi/mx-software-documentation </li>
			</ul>
		</p>
	</div>
</template>
  
<script>
	import { useSpreadsheetStore } from "../stores/spreadsheetStore";
	import { storeToRefs } from 'pinia'

	export default {
		setup() {
			const store = useSpreadsheetStore();

			// extract specific store properties
			const { isValid, displaySpreadsheetModel, emptyDirectoryWarning, validationMessage, captionMessage } = storeToRefs(store)

			return {
				// gives access to the whole store in the template
				store,
				// gives access only to specific state or getter
				isValid, 
				displaySpreadsheetModel,
				emptyDirectoryWarning, 
				validationMessage, 
				captionMessage
			}
		},
		watch: {
			displaySpreadsheetModel(newValue) {
					// do something
					this.store.emptyDirWarning = false;
					this.store.numberOfDewars = "";
					this.store.numberOfPucks = "";
	
					let last_barcode = null;
					let puck_count = 0;
					let last_dewar = null;
					let dewar_count = null;
					let dewar_list = [];
	
					for (let i = 0; i < newValue.length; i++) {
					let elem = newValue[i];
	
					// count puck
					if (elem.puckname !== last_barcode) {
							puck_count += 1;
							last_barcode = elem.puckname;
					}
	
					// count dewar
					if (elem.dewarname !== last_dewar) {
							dewar_list.push(elem.dewarname)
							last_dewar = elem.dewarname;
					}
	
					if (elem.directory.length === 0) {
						this.store.emptyDirWarning = true;
					} 

					if (puck_count > 0) {
						this.store.numberOfPucks = puck_count + " pucks, " + newValue.length + " samples."
					};
				}

				dewar_count = new Set(dewar_list)

				if (dewar_count.size > 0) {
						this.store.numberOfDewars = " You have " + dewar_count.size + " dewars, ";
				}
			}
		}
	}
</script>
