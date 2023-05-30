# ORCHESTRA Pseudonymization Tool

> Developed in the ORCHESTRA EU-project as part of Europe's rapid response to the COVID-19 pandemic, the ORCHESTRA Pseudonymization Tool (OPT) is a pragmatic tool for pseudonymizing subject
> and sample data. Designed for rapid deployment, the OPT has minimal technical requirements and needs no installation. Just like for the usage, the setup does not require any technical
> expertise. It supports also both single and multi-site use without worrying about pseudonym duplication. The tool is available as open source for unlimited use and customization.

---

## Prerequisites

For using the OPT you only need Microsoft Excel (preferred) or LibreOffice Calc.
If you do not have both installed on your computer, you can easily download [LibreOffice](https://de.libreoffice.org/download/download/) for free.

Please make sure that macros are enabled.

## Launching

After downloading, the tool must be configured according to the context of use. This must be done initially before the first use. After the first use, it is strongly recommended not to change the configuration anymore.

## Features

The OPT was built to allow non-technical personell in medical research perform simple patient and sample data pseudonymization. 
We tried to achieve a very low threshold of technical prerequisites by using spreadsheet applications, which in most cases, is already avaible anywhere.

* No installation
* Rapid rollout
* Easy to set up and use
* Pseudonymization of subject and sample data
* Management of pseudonymized data
* Record Linkage
* Label generator (with optional DataMatrix, QR or Barcode)
* High adaptability and flexibility

## Screenshot

![Screenshot](development/documentation/overview.png)


![Screenshot](development/documentation/labels.png)

## Quick start guide

For using the tool, you need to download it from the repository first. For this purpose, we have created the folder "Release" in this GitHub repository. 
This folder contains an "opt-excel-bundle" and an "opt-libreoffice-bundle". 
Everything you need is in here, you do not need the other stuff!
Please download the repository and pick the bundle-version you need. 
The structure of the bundles look like this:

        opt-excel-bundle / opt-libreoffice-bundle
        ├── OPT_Excel.xlsm / OPT_LibreOffice.ods
        ├── user-manual.pdf
        ├── readonly-excel.bat / readonly-libreoffice.bat
        ├── label-printing-app
        │   ├── labels.js
        │   ├── labels.html
        │   ├── labels.css
        │   ├── barcode.min.js
        │   ├── qrcode.min.js
        │   └── datamatrix.min.js
        └── backups

If you use the OPT only on one computer, you can place the bundle on your PC as you like. 
However, if you plan to work with it together with others, then you should save it on an internal network drive to which your colleagues have access. 
You should strongly avoid using online applications such as Excel-Online or Sharepoint for the OPT, as they often conflict with documents, which can lead to data loss and/or duplicate registrations! 

When you have downloaded the repository and picked the required bundle, you can start the OPT by double-clicking on "OPT_Excel.xslm" or "OPT_LibreOffice.ods". Now you can switch directly to the configuration worksheet. Make all necessary configurations there. With a right-click on the worksheet tab and selecting "(Un-)Hide", you can (un-)hide the worksheet. Finally, you can also protect the document structure with a password (Menu -> Tools -> Protect document structure). Please be sure to note the password. The password cannot be recovered in case of loss!

## License

This software is licensed under the Apache License 2.0. The full text is
accessible in the [LICENSE file](LICENSE).

## Acknowledgments

This work has been funded by the European Union Horizon 2020 research and innovation programme under the project ORCHESTRA grant agreement No 101016167.

