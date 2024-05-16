# Project Report

## Overview
This project is developed as part of the COMP1004 coursework. It involves creating a front end using HTML, CSS, and JavaScript that interfaces with a Supabase database to manage and search records of people and vehicles. The main functionalities include:
- Searching for people by name or driving license number.
- Searching for vehicles by registration, make, model, or color.
- Adding new vehicles to the database, including assigning existing or new owners.

## HTML

1. There are 3 HTML pages: [index.html](index.html), [vehicle-search.html](./pages/vehicle-search.html), and [vehicle-add.html](./pages/vehicle-add.html)
2. As seen through the above pages, all files are correctly named
3. All pages contain the correct metadata including language, character set, title, author, description, viewport, and keywords for SEO optimisation. Here is an example from index.html: ![index.html metadata](./images/metadata.png)
4. Heading and text elements have been used appropriately: Here are examples of h2 and label being used from vehicle-search.html: ![h2 and label tags being correctly used](./images/heading-and-label.png)
5. An unordered list has been used to create the navigation links: ![navigation list code](./images/nav-list.png)
6. All of the pages have the above code and as such have the saem menu and same functionality
7. All 3 pages have header, aside, main, and footer tags wrapped in a container div
8. Each page uses the saem image in the aside with additional information provided in the CSS: ![Image tag HTML code](./images/image-tag.png) ![Image tag css](./images/image-css.png)
9. 'Lighthouse' accessibility test is at 100: ![Lighthouse Accessibility test 100 score](./images/lighthouse-test.png)

## CSS

1. All pages are linked to the same external CSS file - [styles.css](styles/styles.css). Here is an example of it being linked: ![Image tag css](./images/css-link.png)
2. CSS Flex has been used to place the navigation links horizontally and only apply to ul that are in the navigation links: ![CSS Flex for navigation](./images/css-flex-nav.png)
3. Location selector has been used to remove the bullet point from the nav list: ![Location Selector to remove list decoration](./images/remove-link-decoration.png)
4. Border, margin, and padding have been added to header, sidebar, main and footer in [styles.css](styles/styles.css)) (lines 15-85).
5. CSS has been used and applied using a container div with ID 'container' with correct ratios: ![HTML for container](./images/container-html.png) ![large screen](./images/container-css.png) The placing of content is done in each individual component (e.g.): ![Header grid placement](./images/full-screen.png) The final grid layout looks as such: 
6. On screen sizes less than 500px, a media query has been used to change the grid layout: ![Media query grid](./images/media-query-grid.png) As such, the final grid layout appears as the following: ![500px screen](./images/mobile-screen.png)

## Javascript and Database

1. Users can search for people by name: ![Search by name](./images/name-search.png) or by license number: ![Search by license number](./images/license-search.png) It also returns partial matches: ![Partial name search](./images/partial-name-search.png) and multiple matches: ![Multiple matches on search](./images/multiple-name-search.png) If there are no matching entries, it also returns an appropriate response: ![Search with no matching entries](./images/no-matches-name-search.png)  This is achieved using the search (lines 15-44) and fetchOwner (lines 47-71) functions in [people.js](/scripts/people.js)
2. Users can search for vehicles by registration number with all apropriate details being displayed: ![Search by registration number](./images/rego-search.png) This also works for entries with missing data: ![Missing data OwnerID](./images/missing-ownerid.png) This is achieved using the search (lines 14-43) and fetchData (lines 46-70) functions in [vehicleSearch.js](/scripts/vehicleSearch.js)
3. Users can enter details for the vehicle they are searching for: ![Add vehicle form](./images/add-vehicle-form.png) If the owner already exists, then a dropdown menu is provided to select the correct owner [vehicleAdd.js](/scripts/vehicleAdd.js) (lines 92-133): ![Select existing owner](./images/select-owner.png) If the owner does not exist, then a new form to add a new person is provided [vehicleAdd.js](/scripts/vehicleAdd.js) (lines 136-171): ![Add person form](./images/add-person-form.png) On 'Add owner', the person is added to the database [vehicleAdd.js](/scripts/vehicleAdd.js) (lines 174-206). On 'Add vehicle', the vehicle is added to the database [vehicleAdd.js](/scripts/vehicleAdd.js) (lines 235-)270.


## Failed Tests

- Search "rachel" should return two records: This test attempts to access the ID 'name'. However, as I have used a selector instead of multiple inputs along with a 'dyamicInput' ID, this test will fail. The search still works appropriately as required: ![Search 'rachel'](./images/search-rachel.png)
- Search "KWK24JI" should return tesla but no owner: Similar to the previous failed test, this test attempts to access the ID 'rego'. However, the use of a selctor along with the 'dynamicInput' ID means the test will fail. The search still works as required: ![Search 'KWK24JI'](./images/search-rego.png)
- Add a vehicle: This test attempts to find the button 'Add vehicle' in the HTML file. However, I have added this dynamically in the [vehicleAdd.js](/scripts/vehicleAdd.js) file to improve UX: ![Add vehicle button code](./images/add-vehicle-dynamic.png)

## Additional Work

- Enhanced the user interface with better styling and responsiveness.
- Added detailed error handling and feedback messages.
- Ensured accessibility compliance with a Lighthouse accessibility score of 100.
- Added Selection menu with more options to make a simpler UI and improve UX
