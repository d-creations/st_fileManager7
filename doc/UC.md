## USE CASES

evalutations
<img src="out/UC/UC.png"></img>

| Column 1 | Column 2|state|important|Desciption|
| ------------- | --------|-----|---------|----------|
| UC1 | Edit a File|init |height|User wants to edit a file|
| UC2 | Maniupulate in explorer|init |height|User wants to create delete or move folder|


#### UC1 Open File

| UC1     | User wants to edit a file|
| ------ |--------|
| level| user goal|
| Primary actor| user|
| standard process|1. user clicks open File</br>2. open File doalog opens </br>3. user select file </br>4. New Tab obens with the file in it </br>5. User Edit File   </br>6. User Saves File</br>7. User Close Tab|
| aditional process|</br>1a. user clicks open Folder</br>&nbsp;&nbsp;1a_2. open Folder doalog opens </br>&nbsp;&nbsp;1a_3. user select folder </br>&nbsp;&nbsp;1a_4.Folder opens in Explorer </br>&nbsp;&nbsp;&nbsp;&nbsp;1a_3a. user not select folder </br>&nbsp;&nbsp;&nbsp;&nbsp;1a_3a_2.Error message shown</br>3a_1. user does not select file</br>&nbsp;&nbsp;3a_2. error message is shown </br></br>6a. user not save file </br>&nbsp;&nbsp;6a_2.User close tab</br>&nbsp;&nbsp;6a_2. message  save the file? </br>&nbsp;&nbsp;6a_3. user says yes </br>|

#### UC2 maniupulate explorer/File

| UC2     | Save a File|
| ------ |--------|
| level| user goal|
| Primary actor| user|
| standard process|1. user right click on file</br>2.System context menu shown</br> 3. User Clicks beside context menu</br>4 context menu close|
| aditional process|  1a. User right click on folder</br>&nbsp;&nbsp;1a_2 Context Menu folder shown</br>&nbsp;&nbsp;1a_3 User Clicks besid menu</br>&nbsp;&nbsp;&nbsp;&nbsp;1a_3b User clicks Folder rename</br>&nbsp;&nbsp;&nbsp;&nbsp;1a_3c User clicks create File</br>&nbsp;&nbsp;&nbsp;&nbsp;1a_3d User clicks delete Folder  </br> &nbsp;&nbsp;1a_4 menu close </br> 3a. User click rename file</br>3b. User click delete file </br>
