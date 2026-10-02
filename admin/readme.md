# More Space — Property Cost Calculator

A public, self-contained calculator for indicative property estimates. The
14-project catalogue, editable charge assumptions and cost-sheet math are
preserved from the existing live tool. Rates must be confirmed with the
developer; this is not a live quotation or offer.

Customer and unit details stay in the browser tab. The tool makes no network
requests for those details and does not save them. Printing/PDF or CSV export
creates a copy on the user's device. There are no team accounts or protected
records in this calculator.

Open `/admin/` on the website. The existing path is retained for existing links.
The main website links to it as **Cost Calculator**.

Numeric inputs must be valid and nonnegative; area and basic rate must be
positive, and floor/count fields use whole numbers. Projects without an
indicative rate require the user to enter one. Invalid inputs clear the preview
and disable printing/exporting. Currency display and export preserve decimals.
CSV text is escaped to prevent user-entered spreadsheet formulas.

The output includes sale consideration, W.E.G.I, corpus, maintenance and GST on
maintenance. Registration and other applicable government taxes are separate.

To run locally: `python3 -m http.server 8000`, then open
`http://localhost:8000/admin/`.
