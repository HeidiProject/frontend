// Formatting data for tables

export function format_main_header(pageType, appDebugMode) {
  switch (pageType) {
    case "standard": {
      if (appDebugMode === true) {
        return "Standard & Native-SAD";
      } else {
        return "Standard Data Collection";
      }
    }
    case "sx":
      return "Serial Crystallography";
    default:
      return;
  }
}

export function format_fqdn_header(collection_type, data) {
  var mode = collection_type;

  switch (mode) {
    case "strategy": {
      var method = "strategy";
      break;
    }
    case "dataset": {
      var method = "fast_xds_1";
      break;
    }
    case "merging": {
      var method = "merging";
      break;
    }
    default:
      return;
  }

  try {
    var fqdn = data["FQDN"][method];
    if (fqdn === "") {
      try {
        fqdn = data.folder;
      } catch (err) {
        fqdn = null; // there is not folder in Merge message. Catch it.
      }
      return fqdn;
    }
    var new_fqdn = fqdn.split("/");
    if (new_fqdn[1] != "sls") {
      return fqdn;
    }
    if (method === "merging") {
      new_fqdn = new_fqdn.slice(6);
    } else {
      new_fqdn = new_fqdn.slice(6, -1);
    }
    fqdn = new_fqdn.join("/");
    return fqdn;
  } catch (err) {
    return null;
  }
}

export function format_fqdn_header_sx(
  collection_type,
  data_screening,
  data_dataset,
  data_merge
) {
  var collection_types = { 0: "dataset", 1: "merging" };

  try {
    var mode = collection_types[collection_type];
  } catch (err) {
    return;
  }
  switch (mode) {
    case "screening": {
      var data = data_screening;
      var method = "strategy";
      break;
    }
    case "dataset": {
      var data = data_dataset;
      var method = "fast_xds_1";
      break;
    }
    case "merging": {
      var data = data_merge;
      var method = "merging";
      break;
    }
    default:
      return;
  }

  try {
    var fqdn = data["FQDN"][method];
    if (fqdn === "") {
      try {
        fqdn = data.folder;
      } catch (err) {
        fqdn = null; // there is not folder in Merge message. Catch it.
      }
      return fqdn;
    }
    var new_fqdn = fqdn.split("/");
    if (new_fqdn[1] != "sls") {
      return fqdn;
    }
    if (method === "merging") {
      new_fqdn = new_fqdn.slice(6);
    } else {
      new_fqdn = new_fqdn.slice(6, -1);
    }
    fqdn = new_fqdn.join("/");
    return fqdn;
  } catch (err) {
    return null;
  }
}

export function format_autoproc_results(data, staraniso = false) {
  var items = [];
  if (data.length != 0) {
    if (staraniso === false) {
      var dataArray = data.result.autoproc;
    } else {
      var dataArray = data.result.autoproc_params.table_staraniso_2;
    }

    items = [
      {
        parameter1: "Low Resolution Limit",
        value1: dataArray[0].low_resolution_limit,
        parameter2: dataArray[1].low_resolution_limit,
        value2: dataArray[2].low_resolution_limit,
      },
      {
        parameter1: "High Resolution Limit",
        value1: dataArray[0].resolution_limit,
        parameter2: dataArray[1].resolution_limit,
        value2: dataArray[2].resolution_limit,
      },
      { parameter1: "", value1: "", parameter2: "", value2: "" },
      {
        parameter1: "Rmerge  (all I+ & I-) [%]",
        value1: dataArray[0].r_factor_observed,
        parameter2: dataArray[1].r_factor_observed,
        value2: dataArray[2].r_factor_observed,
      },
      {
        parameter1: "Rmeas   (within I+/I-) [%]",
        value1: dataArray[0].rmeas_within,
        parameter2: dataArray[1].rmeas_within,
        value2: dataArray[2].rmeas_within,
      },
      {
        parameter1: "Rmeas   (all I+ & I-) [%]",
        value1: dataArray[0].rmeas,
        parameter2: dataArray[1].rmeas,
        value2: dataArray[2].rmeas,
      },
      {
        parameter1: "Rpim    (within I+/I-) [%]",
        value1: dataArray[0].rpim_within,
        parameter2: dataArray[1].rpim_within,
        value2: dataArray[2].rpim_within,
      },
      {
        parameter1: "Rpim    (all I+ & I-)  [%]",
        value1: dataArray[0].rpim,
        parameter2: dataArray[1].rpim,
        value2: dataArray[2].rpim,
      },
      {
        parameter1: "Total no. of observations",
        value1: dataArray[0].observed_reflections,
        parameter2: dataArray[1].observed_reflections,
        value2: dataArray[2].observed_reflections,
      },
      {
        parameter1: "Total no. unique",
        value1: dataArray[0].unique_reflections,
        parameter2: dataArray[1].unique_reflections,
        value2: dataArray[2].unique_reflections,
      },
      {
        parameter1: "Mean(I)/sd(I)",
        value1: dataArray[0].Isigma,
        parameter2: dataArray[1].Isigma,
        value2: dataArray[2].Isigma,
      },
      {
        parameter1: "Multiplicity",
        value1: dataArray[0].multiplicity,
        parameter2: dataArray[1].multiplicity,
        value2: dataArray[2].multiplicity,
      },
      {
        parameter1: "CC(1/2) [%]",
        value1: dataArray[0].cc_half,
        parameter2: dataArray[1].cc_half,
        value2: dataArray[2].cc_half,
      },
      { parameter1: "", value1: "", parameter2: "", value2: "" },
      {
        parameter1: "Ano multipl",
        value1: dataArray[0].anomalous_multiplicity,
        parameter2: dataArray[1].anomalous_multiplicity,
        value2: dataArray[2].anomalous_multiplicity,
      },
      {
        parameter1: "CC(ano) [%]",
        value1: dataArray[0].anomalous_correlation,
        parameter2: dataArray[1].anomalous_correlation,
        value2: dataArray[2].anomalous_correlation,
      },
      {
        parameter1: "|DANO|/sd(DANO)",
        value1: dataArray[0].sigAno,
        parameter2: dataArray[1].sigAno,
        value2: dataArray[2].sigAno,
      },
    ];

    if (staraniso === false) {
      var empty_line = {
        parameter1: "-",
        value1: "-",
        parameter2: "-",
        value2: "-",
      };
      var line = {
        parameter1: "Completeness",
        value1: dataArray[0].completeness,
        parameter2: dataArray[1].completeness,
        value2: dataArray[2].completeness,
      };
      items.splice(11, 0, line, empty_line);
      var line = {
        parameter1: "Ano completeness",
        value1: dataArray[0].anomalous_completeness,
        parameter2: dataArray[1].anomalous_completeness,
        value2: dataArray[2].anomalous_completeness,
      };
      items.splice(16, 0, line, empty_line);
    } else {
      var line = {
        parameter1: "Compl (spherical)",
        value1: dataArray[0].completeness,
        parameter2: dataArray[1].completeness,
        value2: dataArray[2].completeness,
      };
      var line2 = {
        parameter1: "Compl (ellipsoidal)",
        value1: dataArray[0].completeness_ellipsoidal,
        parameter2: dataArray[1].completeness_ellipsoidal,
        value2: dataArray[2].completeness_ellipsoidal,
      };
      items.splice(11, 0, line, line2);
      var line = {
        parameter1: "Ano compl (spherical)",
        value1: dataArray[0].anomalous_completeness,
        parameter2: dataArray[1].anomalous_completeness,
        value2: dataArray[2].anomalous_completeness,
      };
      var line2 = {
        parameter1: "Ano multipl (ellipsoidal)",
        value1: dataArray[0].anomalous_completeness_ellipsoidal,
        parameter2: dataArray[1].anomalous_completeness_ellipsoidal,
        value2: dataArray[2].anomalous_completeness_ellipsoidal,
      };
      items.splice(16, 0, line, line2);
    }
  }
  return items;
}

export function format_xia2dials_results(data) {
  var items = [];
  if (data.length != 0) {
    var dataArray = data.result.xia2dials;
    items = [
      {
        parameter1: "Low Resolution Limit",
        value1: dataArray[0].low_resolution_limit,
        parameter2: dataArray[1].low_resolution_limit,
        value2: dataArray[2].low_resolution_limit,
      },
      {
        parameter1: "High Resolution Limit",
        value1: dataArray[0].resolution_limit,
        parameter2: dataArray[1].resolution_limit,
        value2: dataArray[2].resolution_limit,
      },
      { parameter1: "", value1: "", parameter2: "", value2: "" },
      {
        parameter1: "Rmerge  (all I+ & I-) [%]",
        value1: dataArray[0].r_factor_observed,
        parameter2: dataArray[1].r_factor_observed,
        value2: dataArray[2].r_factor_observed,
      },
      {
        parameter1: "Rmeas   (within I+/I-) [%]",
        value1: dataArray[0].rmeas_within,
        parameter2: dataArray[1].rmeas_within,
        value2: dataArray[2].rmeas_within,
      },
      {
        parameter1: "Rmeas   (all I+ & I-) [%]",
        value1: dataArray[0].rmeas,
        parameter2: dataArray[1].rmeas,
        value2: dataArray[2].rmeas,
      },
      {
        parameter1: "Rpim    (within I+/I-) [%]",
        value1: dataArray[0].rpim_within,
        parameter2: dataArray[1].rpim_within,
        value2: dataArray[2].rpim_within,
      },
      {
        parameter1: "Rpim    (all I+ & I-)  [%]",
        value1: dataArray[0].rpim,
        parameter2: dataArray[1].rpim,
        value2: dataArray[2].rpim,
      },
      {
        parameter1: "Total no. of observations",
        value1: dataArray[0].observed_reflections,
        parameter2: dataArray[1].observed_reflections,
        value2: dataArray[2].observed_reflections,
      },
      {
        parameter1: "Total no. unique",
        value1: dataArray[0].unique_reflections,
        parameter2: dataArray[1].unique_reflections,
        value2: dataArray[2].unique_reflections,
      },
      {
        parameter1: "Mean(I)/sd(I)",
        value1: dataArray[0].Isigma,
        parameter2: dataArray[1].Isigma,
        value2: dataArray[2].Isigma,
      },
      {
        parameter1: "Completeness",
        value1: dataArray[0].completeness,
        parameter2: dataArray[1].completeness,
        value2: dataArray[2].completeness,
      },
      {
        parameter1: "Multiplicity",
        value1: dataArray[0].multiplicity,
        parameter2: dataArray[1].multiplicity,
        value2: dataArray[2].multiplicity,
      },
      {
        parameter1: "CC(1/2) [%]",
        value1: dataArray[0].cc_half,
        parameter2: dataArray[1].cc_half,
        value2: dataArray[2].cc_half,
      },
      { parameter1: "", value1: "", parameter2: "", value2: "" },
      {
        parameter1: "Anomalous completeness",
        value1: dataArray[0].anomalous_completeness,
        parameter2: dataArray[1].anomalous_completeness,
        value2: dataArray[2].anomalous_completeness,
      },
      {
        parameter1: "Ano multipl",
        value1: dataArray[0].anomalous_multiplicity,
        parameter2: dataArray[1].anomalous_multiplicity,
        value2: dataArray[2].anomalous_multiplicity,
      },
      {
        parameter1: "CC(ano) [%]",
        value1: dataArray[0].anomalous_correlation,
        parameter2: dataArray[1].anomalous_correlation,
        value2: dataArray[2].anomalous_correlation,
      },
    ];
  }

  return items;
}

export function format_collection_parameters(data) {
  if (data === null) {
    return [];
  }
  var items = [];
  if (Object.keys(data).length > 0) {
    // Check if the detector is using 4M ROI on 6D beamline
    var detector = data.detector;
    var roi = data.roi;
    if (roi === "4M") {
      detector = detector + " (ROI " + roi + ")";
    }
    items = [
      { parameter: "Oscillation Angle (\u00B0)", value: data.oscillationAngle },
      { parameter: "Exposure Time (s)", value: data.exposureTime },
      { parameter: "Beam Transmission", value: data.beamTransmission },
      { parameter: "Number of Frames", value: data.numFramesTotal },
      { parameter: "Detector Distance (mm)", value: data.detectorDistance },
      { parameter: "Wavelength (\u00C5)", value: data.wavelength.toFixed(3) },
      { parameter: "Detector", value: detector },
      // { parameter: "Chi (\u00B0)", value: data.chi.toFixed(2) },
      // { parameter: "Phi (\u00B0)", value: data.phi.toFixed(2) },
      // { parameter: "Flux (ph/s)", value: data.beamlineFluxAtSample.toExponential(2) },
      // { parameter: "Aperture", value: data.aperture },
      // { parameter: "Beam Size w x h (mm)", value: data.beamSizeHeight + " x " + data.beamSizeWidth },
    ];
  }
  return items;
}

export function format_merging_parameters(data) {
  data = data.result.merging.table_1;

  if (data === null) {
    return [];
  }
  var items = [];
  if (data.length != 0) {
    // Check if the detector is using 4M ROI on 6D beamline
    var cell_selection_value = data.Cell_selection;
    if (data.hasOwnProperty("Cell_selection_nr_clusters")) {
      var cell_selection_value =
        data.Cell_selection + " (" + data.Cell_selection_nr_clusters + ")";
    }

    var pcc_selection_value = data.pCC_selection;
    if (data.hasOwnProperty("pCC_selection_nr_clusters"))
      var pcc_selection_value =
        data.pCC_selection + " (" + data.pCC_selection_nr_clusters + ")";

    items = [
      { parameter: "No. of Datasets", value: data.Nr_of_datasets },
      {
        parameter: "No. of Processed Datasets",
        value: data.Nr_of_proc_datasets,
      },
      { parameter: "Indexing Check", value: data.Indexing_check },
      { parameter: "ISa Selection", value: data.Isa_selection },
      //  {parameter: 'Cell Selection', value: data.Cell_selection},
      //  {parameter: 'pCC Selection', value: data.pCC_selection},
      { parameter: "Cell Selection (#clust.)", value: cell_selection_value },
      { parameter: "pCC Selection (#clust.)", value: pcc_selection_value },
      { parameter: "Anisotropy", value: data.Anisotropy },
      { parameter: "Isocluster no.", value: data.Isocluster_nr },
    ];
  }
  return items;
}

export function format_merging_cell_parameters(data) {
  data = data.result.merging.table_2;

  if (data === null) {
    return [];
  }
  var items = [];
  if (data.length != 0) {
    // Check if the detector is using 4M ROI on 6D beamline

    items = [
      {
        parameter1: "a",
        value1: data.a,
        parameter2: "alpha",
        value2: data.alpha,
      },
      {
        parameter1: "b",
        value1: data.b,
        parameter2: "beta",
        value2: data.beta,
      },
      {
        parameter1: "c",
        value1: data.c,
        parameter2: "gamma",
        value2: data.gamma,
      },
      {
        parameter1: "Space Group Label",
        value1: data.spaceGroupLabel,
        parameter2: "Space Group Number",
        value2: data.spaceGroupNumber,
      },
    ];
  }

  return items;
}

export function format_xtal_params_4rows(data) {
  if (data === null) {
    return [];
  }

  if (data.length === 0) {
    return [];
  }
  var method = null;
  if (data.adpStatus.fast_xds_3 === "completed") {
    method = "fast_xds_3_params";
  }

  if (data.adpStatus.gocom === "completed") {
    method = "gocom_params";
  }

  if (data.adpStatus.gopy === "completed") {
    method = "gopy_params";
  }

  if (data.adpStatus.autoproc === "completed") {
    method = "autoproc_params";
  }

  if (data.adpStatus.xia2dials === "completed") {
    method = "xia2dials_params";
  }

  if (method === null) {
    return [];
  }
  var items = [];
  items = [
    {
      parameter1: "a",
      value1: data.result[method]["a"],
      parameter2: "alpha",
      value2: data.result[method]["alpha"],
    },
    {
      parameter1: "b",
      value1: data.result[method]["b"],
      parameter2: "beta",
      value2: data.result[method]["beta"],
    },
    {
      parameter1: "c",
      value1: data.result[method]["c"],
      parameter2: "gamma",
      value2: data.result[method]["gamma"],
    },
    {
      parameter1: "Space Group",
      value1: data.result[method]["spaceGroupLabel"],
      parameter2: "Space Group Number",
      value2: data.result[method]["spaceGroupNumber"],
    },
    {
      parameter1: "Mosaicity",
      value1: data.result[method]["mosaicity"],
      parameter2: "ISA",
      value2: data.result[method]["isa"],
    },
    {
      parameter1: "Wilson B Factor",
      value1: data.result[method]["wilsonBfactor"],
      parameter2: "",
      value2: "",
    },
  ];

  return items;
}

export function format_strategy_parameters(data) {
  if (data === null) {
    return [];
  }

  if (Object.keys(data).length === 0) {
    return [];
  }
  var method = "strategy_params";
  var items = [];
  items = [
    {
      parameter1: "a",
      value1: data.result[method]["a"],
      parameter2: "alpha",
      value2: data.result[method]["alpha"],
    },
    {
      parameter1: "b",
      value1: data.result[method]["b"],
      parameter2: "beta",
      value2: data.result[method]["beta"],
    },
    {
      parameter1: "c",
      value1: data.result[method]["c"],
      parameter2: "gamma",
      value2: data.result[method]["gamma"],
    },
    {
      parameter1: "Space Group",
      value1: data.result[method]["spaceGroupLabel"],
      parameter2: "Space Group No.",
      value2: data.result[method]["spaceGroupNumber"],
    },
    {
      parameter1: "Mosaicity",
      value1: data.result[method]["mosaicity"],
      parameter2: "High Resolution",
      value2: data.result[method]["highResolution"],
    },
  ];

  return items;
}

export function get_xtal_params_status(data) {
  var status = "processing...";
  if (data === null) {
    return;
  }
  if (data.length != 0) {
    if (data.adpStatus.fast_xds_3 === "completed") {
      status = "Fast Processing";
    } else if (data.adpStatus.fast_xds_3 === "error") {
      status = "Error in processing...";
    } else if (data.adpStatus.fast_xds_3 === "aborted") {
      status = "Data processing aborted...";
    }

    if (data.adpStatus.gopy === "completed") {
      status = "Go.py";
    }
    if (data.adpStatus.autoproc === "completed") {
      status = "autoPROC";
    }
    if (data.adpStatus.xia2dials === "completed") {
      status = "Dials";
    }
  }
  return status;
}

// End formating data for tables

export function resultIsComplete(data, type) {
  if (data === null || data === undefined) {
    return false;
  }
  if (data.length != 0) {
    // var status = data[0].adpStatus[type];
    var status = data.adpStatus[type];
    return status === "completed";
  }
}

export function resultIsRunningOrPending(data, type) {
  if (data === null) {
    return false;
  }
  if (data.length != 0) {
    // var status = data[0].adpStatus[type];
    var status = data.adpStatus[type];
    if (status === "running" || status === "pending") {
      return true;
    } else {
      return false;
    }
  }
}

export function resultIsErrorOrAbort(data, type) {
  if (data === null || data === undefined) {
    return false;
  }
  if (data.length != 0) {
    // var status = data[0].adpStatus[type];
    var status = data.adpStatus[type];
    if (status === "error" || status === "aborted") {
      return true;
    } else {
      return false;
    }
  }
}

export function statusIconForCollectionType(
  collection_type,
  data_screening,
  data_dataset,
  data_merge
) {
  // wraper around statusIcon, for iron-pages
  var collection_types = { 0: data_screening, 1: data_dataset, 2: data_merge };
  var data = collection_types[collection_type];
  return statusIcon(data);
}

export function getAngularRange(data, adpType) {
  if (data === null) {
    this._plotData = [];
    return;
  }
  if (data.length === 0) {
    this._plotData = [];
    return;
  }

  var rangeItems = data["angularRange"];
  if (adpType in rangeItems) {
    var angularRange = rangeItems[adpType];
  } else {
    angularRange = null;
  }
  return angularRange;
}

export function mergeTableSelection(data) {
  if (data === null) {
    return;
  }

  if (data.length === 0) {
    return;
  }

  if (data.result.merging.table_6.length !== 0) {
    return { table_no: "table_6", label: "pCC Selection" };
  }
  if (data.result.merging.table_5.length !== 0) {
    return { table_no: "table_5", label: "Cell Selection" };
  }

  if (data.result.merging.table_4.length !== 0) {
    return { table_no: "table_4", label: "ISa Selection" };
  }

  if (data.result.merging.table_3.length !== 0) {
    return { table_no: "table_3", label: "No Selection" };
  }
}

export function mergeTableExists(data, table_no) {
  if (data === null) {
    return false;
  }

  if (data.length === 0) {
    return false;
  }

  if (data.result.merging[table_no].length !== 0) {
    return true;
  }
  return false;
}
