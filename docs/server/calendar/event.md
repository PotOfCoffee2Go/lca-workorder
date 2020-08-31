# Calendar Event Scheduler


<script>
poc2go.cal = ics();
poc2go.cal.addEvent('Task #1 Order LCA-345', 'Fix broken thing!', 'Walterboro', '09/03/2020 10:00', '09/03/2020 11:00');

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

console.log(uuidv4());
</script>

<button type="button" onclick="javascript:poc2go.cal.download('order-LCA-345')">Download</button>


::script-server/calendar/deps.only.min.js::

::script-server/calendar/ics.js::
