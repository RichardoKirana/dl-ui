import {
  inject,
  bindable,
  computedFrom
} from "aurelia-framework";
import {
  callbackify
} from "util";
var ConstructionLoader = require("../../../loader/weaving-constructions-loader");
var UnitLoader = require("../../../loader/unit-loader");
var YarnOriginLoader = require("../../../loader/weaving-yarn-origin-loader");
var moment = require("moment");

export class DataForm {
  @bindable title;
  @bindable readOnly;
  @bindable FabricConstructionDocument;
  @bindable Month;
  @bindable Year;

  months = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  
  years = [];

  formOptions = {
    cancelText: "Kembali",
    saveText: "Simpan",
    deleteText: "Hapus",
    editText: "Ubah"
  };

  months = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  bind(context) {
    this.context = context;
    this.data = this.context.data;
    this.error = this.context.error;

    // this.Month = this.months[this.getMonth()];

    // if (this.data.Id) {
    //   if (this.readOnly) {
    //     this.Month = this.data.Period.Month;
    //     this.Year = this.data.Period.Year;
    //     this.FabricConstructionDocument = this.data.FabricConstructionDocument;
    //   } else {
    //     this.Month = this.data.Period.Month;
    //     var yearData = this.data.Period.Year;
    //     this.Year = this.getYears(yearData);
    //     this.FabricConstructionDocument = this.data.FabricConstructionDocument;
    //   }
    // } else {
    //   this.data.Period = {};
    //   this.data.Period.Month = this.Month;
    //   this.Year = this.getYears();
    // }

    this.currentYearItem = parseInt(moment().format('YYYY'));
    this.minYearItem = this.currentYearItem - 10;
    this.maxYearItem = this.currentYearItem + 10;

    for (var i = parseInt(this.minYearItem); i <= parseInt(this.maxYearItem); i++) {
      this.years.push(i.toString());
    }

    this.cancelCallback = this.context.cancelCallback;
    this.deleteCallback = this.context.deleteCallback;
    this.editCallback = this.context.editCallback;
    this.saveCallback = this.context.saveCallback;
  }

  get origins() {
    return YarnOriginLoader;
  }

  get constructions() {
    return ConstructionLoader;
  }

  get units() {
    return UnitLoader;
  }

  FabricConstructionDocumentChanged(newValue) {
    if (newValue) {
      if (newValue.Id) {
        this.data.FabricConstructionDocument = newValue;
        this.data.FabricConstructionDocument.Id = newValue.Id;
        this.data.FabricConstructionDocument.ConstructionNumber = newValue.ConstructionNumber;

        var ConstructionNumberSplitted = newValue.ConstructionNumber.split(" ");
        var WarpCode = ConstructionNumberSplitted[ConstructionNumberSplitted.length - 2]
        var WeftCode = ConstructionNumberSplitted[ConstructionNumberSplitted.length - 1]
        var WarpWeftCode = WarpCode + "X" + WeftCode;
        this.data.YarnType = WarpWeftCode;
      }
    }
  }

  MonthChanged(newValue) {
    this.data.Period.Month = newValue;
  }

  YearChanged(newValue) {
    this.data.Period.Year = newValue;
  }

  // getYears() {
  //   var year = moment(new Date());
  //   this.years.push(year.year());
  //   var nextYear = year.add(1, "years");
  //   this.years.push(nextYear.year());
  //   var nextYear = year.add(1, "years");
  //   this.years.push(nextYear.year());
  //   var nextYear = year.add(1, "years");
  //   this.years.push(nextYear.year());
  // }

  // getMonth() {
  //   return new Date().getMonth() + 1;
  // }
}
