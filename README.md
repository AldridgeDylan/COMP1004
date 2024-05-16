# README Report

## Overview
This project is developed as part of the COMP1004 coursework. It involves creating a front end using HTML, CSS, and JavaScript that interfaces with a Supabase database to manage and search records of people and vehicles. The main functionalities include:
- Searching for people by name or driving license number.
- Searching for vehicles by registration, make, model, or color.
- Adding new vehicles to the database, including assigning existing or new owners.

## HTML

1. There are 3 HTML pages: [index.html](index.html), [vehicle-search.html](./pages/vehicle-search.html), and [vehicle-add.html](./pages/vehicle-add.html)
2. As seen through the above pages, all files are correctly named
3. All pages contain the correct metadata including language, character set, title, author, description, viewport, and keywords for SEO optimisation. Here is an example from index.html: ![index.html metadata](./images/metadata.png)
4. Heading and text elements have been used appropriately: Here are examples of their uses from vehicle-search.html: ![index.html metadata](./images/metadata.png)

## CSS

## Javascript and Database

## Failed Tests

- Search "rachel" should return two records: This test attempts to access the ID 'name'. However, as I have used a selector instead of multiple inputs along with a 'dyamicInput' ID, this test will fail. The search still works appropriately as required: ![Search 'rachel'](./images/search-rachel.png)
- Search "KWK24JI" should return tesla but no owner: Similar to the previous failed test, this test attempts to access the ID 'rego'. However, the use of a selctor along with the 'dynamicInput' ID means the test will fail. The search still works as required: ![Search 'KWK24JI'](./images/search-rego.png)
- Add a vehicle: This test attempts to find the button 'Add vehicle' in the HTML file. However, I have added this dynamically in the [vehicleAdd.js](/scripts/vehicleAdd.js) file to improve UX: ![Add vehicle button code](./images/add-vehicle-dynamic.png)

## Additional Work

- Enhanced the user interface with better styling and responsiveness.
- Added detailed error handling and feedback messages.
- Ensured accessibility compliance with a Lighthouse accessibility score of 100.
- Added Selection menu to make a simpler UI and improve UX
