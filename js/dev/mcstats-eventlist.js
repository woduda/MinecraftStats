mcstats.showEventList = function() {
    var viewHTML = '';

    var generateList = function(keysByDate){
        var tbody = '';
        keysByDate.forEach(function(id){
            var e = mcstats.events[id];
            var award = mcstats.awards[e.link];

            var eventWidget = mcstats.eventWidget(id);
            if(e.active) {
                eventWidget += `<span class="text-success ml-2">[LIVE]</span>`;
            }

            var holder, info;
            if(e.best) {
                holder = mcstats.playerWidget(e.best.uuid);
                info = award.desc + ': ' + mcstats.formatValue(e.best.value, award.unit, true);
            } else {
                holder = mcstats.playerWidget(false);
                info = `<span class="text-muted">(${award.desc})</span>`;
            }

            var eventTime;
            if(e.active) {
                eventTime = `Going since ${formatDate(e.startTime)}`;
            } else {
                eventTime = `${formatDate(e.startTime)} - ${formatDate(e.stopTime)}`;
            }

            var eventStartTime = formatTime(e.startTime);
            var live = e.active
                ? `<span class="pl-2 text-success">[LIVE]</span>`
                : `<span class="pl-2 text-danger">[Finished]</span>`;

            tbody += `
                <div class="row">
                <div class="col-sm">
                    <div class="container p-1 mb-3 mcstats-entry">
                        <div class="p-1 mb-1 round-box text-center">
                            <div class="h4">
                                <img class="img-pixelated img-textsize align-baseline" src="img/award-icons/${e.link}.png" alt="${id}" title="${e.title}"/>
                                <a href="#event:${id}">${e.title}</a>
                                ${live}
                            </div>
                            <div class="text-muted">
                                ${eventTime}
                            </div>
                        </div>
                        <div class="p-1 round-box text-center">
                            <span class="rank-1">${e.active ? "Leading:" : "Winner:"}</span>
                            ${holder}
                            <br/>
                            ${info}
                        </div>
                    </div>
                </div>
                </div>
            `;
        });
        return tbody;
    };

    var eventsLive = generateList(mcstats.liveEventKeysByDate);
    var eventsFinished = generateList(mcstats.finishedEventKeysByDate);

    // show
    mcstats.viewContent.innerHTML = `
        <div class="text-center mb-2">
            <div class="h5 text-shadow">Ongoing Events</div>
        </div>
        ${eventsLive}
        <div class="text-center mb-2 mt-4">
            <div class="h5 text-shadow">Finished Events</div>
        </div>
        ${eventsFinished}
    `;
    mcstats.showView('Events', false, false, false);
};
