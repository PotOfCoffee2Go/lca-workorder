# LCA Worksheets


<!-- The `multiple` attribute lets users select multiple files. -->
::tx-.7::<input type="file" id="file-selector" accept=".csv">

::box id-drop-area::<div>

::tx-1.2:: or drag/drop here

</div>

<button id="btnStoreCompany" class="btnTemplateSheet" type="button">Company</button>
<button id="btnStoreWorkorder" class="btnTemplateSheet" type="button">Workorder</button>
<button id="btnStoreAssociate" class="btnTemplateSheet" type="button">Associate</button>
<a id="storeFile" download="TBD.txt" href="#" style="display:none"> </a>


<style>
.btnTemplateSheet, input[type='file'] {opacity: 1;}
</style>


::script-https://cdn.rawgit.com/Keyang/node-csvtojson/d41f44aa/browser/csvtojson.min.js::
::script-https://cdn.jsdelivr.net/npm/json2csv::

Author: PotOfCoffee2Go
Created: Aug. 24, 2020
Updated: Aug. 24, 2020
::comment:: License:
