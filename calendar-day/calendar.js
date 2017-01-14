// Say hello.
console.log('Hello!🙂');

// Hours a day
const hours = [
  {from: 9, to: 10, period: 'AM'},
  {from: 10, to: 11, period: 'AM'},
  {from: 11, to: 12, period: 'AM'},
  {from: 12, to: 1, period: 'PM'},
  {from: 1, to: 2, period: 'PM'},
  {from: 2, to: 3, period: 'PM'},
  {from: 3, to: 4, period: 'PM'},
  {from: 4, to: 5, period: 'PM'},
  {from: 5, to: 6, period: 'PM'},
  {from: 6, to: 7, period: 'PM'},
  {from: 7, to: 8, period: 'PM'},
  {from: 8, to: 9, period: 'PM'}
];
// console.table(hours);

// Events of the day
const events = [
  {start: 30, end: 150},
  {start: 540, end: 600},
  {start: 560, end: 620},
  {start: 610, end: 670}
];

/**
 * Renders the HTML for events on a single day calendar.
 *
 * @param {array} - An array of event objects with a start and end property.
 */
function layOutDay(events) {
  // DOM rendering target
  const eventList = document.querySelector('.event-list');

  // Clear the DOM.
  eventList.innerHTML = '';

  const minutesTotal = 720;
  const heightPerMinute = minutesTotal / hours.length / 60;
  const eventMinHeight = 40;
  const W = 100; // Base event width (in percent)
  const numberOfEvents = [];

  // Make sure events are ordered ascending by start time.
  // In doing so, we can check if subsequent events collide in time.
  const eventsOrderedAsc = events.sort((a, b) => a.start - b.start);
  // console.table(eventsOrderedAsc);

  // How many events happen at the same time in any given minute?
  for (let minute = 0; minute <= minutesTotal; minute++) {
    for (let i = 0; i < eventsOrderedAsc.length; i++) {
      if (minute >= events[i].start && minute <= events[i].end) {
        numberOfEvents[minute] = !numberOfEvents[minute] ? 1 : numberOfEvents[minute] + 1;
      }
    }
  }
  // console.log(numberOfEvents);



  const laidOutEvents = eventsOrderedAsc.map((event, index, array) => {
    // Event duration in minutes
    const duration = event.end - event.start;

    // Calculate height of event based on its duration and provide
    // minimum height for short events.
    const eventHeight = duration * heightPerMinute < 15 ? eventMinHeight : duration * heightPerMinute;

    // Number of how many events collide in time with the current one (incl. the current event).
    // We use this factor to adjust the width as well as the horizontal position accordingly
    // for preventing visually overlapping events.
    // (e.g., a factor of 3 will give us a width of 33,3333% (think of 3 columns)).
    const factor = Math.max(numberOfEvents[event.start], numberOfEvents[event.end]);

    // Does the next event collide in time with the current one?
    // If so, we assign a value to adjust its horizontal position.
    if (array[index+1] && (array[index+1].start < array[index].end)) {
      // Is the current event's horizontal position already adjusted?
      // Then we check if there is also an overlap between the next event
      // and the previous event.
      if (array[index].xPos) {
        if (array[index+1].start > array[index-1].end) {
          array[index+1].xPos = array[index-1].xPos;
        } else {
          array[index+1].xPos = array[index].xPos + 1
        }
      } else {
        array[index+1].xPos = 1;
      }
    }

    const laidOut = {
      start: event.start,
      end: event.end,
      width: W / factor,
      height: eventHeight,
      top: event.start,
      left: W / factor * event.xPos || 0
    }
    return laidOut;
  });

  // console.table(laidOutEvents);

  const html = laidOutEvents.map(event => {
    const {top, left, width, height} = event;
    return `
    <li class="event-item" style="top:${top}px; left:${left}%; width:${width}%; height:${height}px">
      <div class="event-details">
        <h3 class="event-title">Sample Item</h3>
        <h4 class="event-location">Sample Location</h4>
      </div>
    </li>
    `;
  }).join('');

  eventList.innerHTML = html;
}


/**
 * Renders the HTML of a timeline, e.g. from 9am to 9pm.
 *
 * @param {array} - An array of objects each of which represents an hour-long time slot.
 */
function layOutTimeline(hours) {
  // DOM rendering target
  const timeslots = document.querySelector('.time-slots');

  const html = hours.map(slot => {
    return `
      <li class="slot">
        <div class="slot-from" data-period=${slot.period}>${slot.from}:00</div>
        <div class="slot-half">${slot.from}:30</div>
        <div class="slot-to" data-period=${slot.period}>${slot.to}:00</div>
      </li>
    `;
  }).join('');

  timeslots.innerHTML = html;
}

layOutTimeline(hours);
layOutDay(events);
