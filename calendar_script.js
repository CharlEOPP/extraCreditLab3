const modality = document.getElementById("event_modality");
const inPersonFields = document.getElementById("inPersonFields");
const remoteFields = document.getElementById("remoteFields");

const locationInput = document.getElementById("event_location");
const urlInput = document.getElementById("event_remote_url");

let eventEdit = null;//variable to see if an event is being updated

function updateLocationOptions(value) {

  inPersonFields.classList.add("d-none");
  remoteFields.classList.add("d-none");

  locationInput.removeAttribute("required");
  urlInput.removeAttribute("required");

  if (value === "inperson") {
    inPersonFields.classList.remove("d-none");
    locationInput.setAttribute("required", true);
  } else if (value === "remote") {
    remoteFields.classList.remove("d-none");
    urlInput.setAttribute("required", true);
  }
}

const categoryColors = {
  Work: "#ADD8E6",
  Academic: "#FF6961",
  Social:"#FFFFE0",
  Health:"#90EE90"
}

function eventEditor(eventDetails){
  document.getElementById('event_name').value = eventDetails.name;
  document.getElementById('event_weekday').value = eventDetails.weekday;
  document.getElementById('event_time').value = eventDetails.time;
  document.getElementById('event_modality').value = eventDetails.modality;
  document.getElementById('event_category').value = eventDetails.category;
  document.getElementById('event_attendees').value = eventDetails.attendees;
  updateLocationOptions(eventDetails.modality);
  document.getElementById('event_location').value = eventDetails.location;
  document.getElementById('event_remote_url').value = eventDetails.remote_url;

  // Open modal to edit info
  const modalEl = document.getElementById('event_modal');
  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  modal.show();
}

function createEventCard(eventDetails) {
  let event_element = document.createElement('div');
  event_element.classList = 'event row border rounded m-1 py-1';
  event_element.style.backgroundColor = categoryColors[eventDetails.category] || "#fff";
  let info = document.createElement('div');
  info.innerHTML =     
    eventDetails.name + "<br>" +
    "Category: " + eventDetails.category + "<br>" +
    "Day: " + eventDetails.weekday + "<br>" +
    "Time: " + eventDetails.time + "<br>" +
    "Modality: " + eventDetails.modality + "<br>" +
    `${(eventDetails.modality == "remote") ? "URL: " + eventDetails.remote_url + "<br>":"Location: " + eventDetails.location + "<br>"}` + 
    "Attendees: " + eventDetails.attendees;
  event_element.appendChild(info);

  //had trouble about card not remembering edited data so made the card remember the data so it can be changed
  event_element.eventData = {...eventDetails};

  //looks for click on the card
  event_element.addEventListener('click', function() {
    eventEdit = event_element; 
    eventEditor(event_element.eventData); 
  });

  return event_element;
}

function addEventToCalendar(eventInfo){
  let event_card = createEventCard(eventInfo);
  let day = document.getElementById(eventInfo.weekday.toLowerCase());
  day.appendChild(event_card);
}

function saveEvent(){
  const form = document.getElementById('eventForm');
  if (!form.checkValidity()) {
    form.reportValidity(); // triggers browser validation messages
    return; // stop saving
  }
  const eventDetails = {
        name: document.getElementById("event_name").value,  // name of the event from the form,
        weekday: document.getElementById("event_weekday").value,  //weekday of the event from the form,
        time: document.getElementById("event_time").value, //time of the event from the form,
        modality: document.getElementById("event_modality").value,//modality of the event from the form,
        location: document.getElementById("event_location").value,//if the modality is "In-person" then this has a value and remote_url is null,
        remote_url: document.getElementById("event_remote_url").value,//if the modality is "Remote" then this has a value location is null,
        attendees: document.getElementById("event_attendees").value,//list of attendees from the form
        category: document.getElementById("event_category").value//category of the event
  };

  //if card is being edited
  if(eventEdit){
    eventEdit.innerHTML =""; // clears html in event card
    //does what createEventCard does but with fewer steps
    let info = document.createElement('div');
    info.innerHTML =     
      eventDetails.name + "<br>" +
      "Category: " + eventDetails.category + "<br>" +
      "Day: " + eventDetails.weekday + "<br>" +
      "Time: " + eventDetails.time + "<br>" +
      "Modality: " + eventDetails.modality + "<br>" +
      `${(eventDetails.modality == "remote") ? "URL: " + eventDetails.remote_url + "<br>":"Location: " + eventDetails.location + "<br>"}` + 
      "Attendees: " + eventDetails.attendees;
    eventEdit.style.backgroundColor = categoryColors[eventDetails.category] || "#ffffff";
    eventEdit.appendChild(info);

    //updates stored data on card so it remembers the edits
    eventEdit.eventData = {...eventDetails};

    // checks if it has to be in a new day
    const dayChange = document.getElementById(eventDetails.weekday.toLowerCase());
    dayChange.appendChild(eventEdit);

    eventEdit = null; //change was made so nothing is being edited

  } else{
    //does it normally
     addEventToCalendar(eventDetails);
  }

 
  document.getElementById('eventForm').reset();
  const modalEl = document.getElementById('event_modal');
  const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
  modal.hide();
}
