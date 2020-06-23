Vue.component("event-round", {
  template: `<div :class="{active: isactive}" @click='$emit("click")' class='event-rounds'><slot></slot></div>`,
  props: ["isactive"],
});

Vue.component("event-leader", {
  template: `<div class="card event-leaders">
    <p class="leader-name">{{leader.name}}</p>
    <p class="leader-username">{{leader.username}}</p>
    <p class="leader-points">{{leader.points}}</p>
    <p class="leader-rank">#{{ leader.rank }}</p>
  </div>`,
  props: ["leader"],
});

Vue.component("event-order", {
  template: `<div class="ordering-container"><div class="ordering-button">order</div><div>`,
});

Vue.component("event-participant", {
  template: `<div class="card event-participant">
  <div class="participant-left">
  <p class="participant-rank">#{{ participant.rank }}</p>
  <p class="participant-name">{{participant.name}}</p>
  <p class="participant-username">{{participant.username}}</p>
  </div>
  <p class="participant-points">{{participant.points}}</p>
</div>`,
  props: ["participant"],
});

const __cloneObject = (obj) => JSON.parse(JSON.stringify(obj));

new Vue({
  el: "#app",
  created() {
    fetch("./assets/sample.json").then((res) => {
      return res.json().then((data) => {
        let overall = {};
        Object.values(data).forEach((round) =>
          round.forEach((entry) => {
            if (!overall[entry.username]) {
              overall[entry.username] = __cloneObject(entry);
              overall[entry.username].points = 0;
            }
            overall[entry.username].points += entry.points;
          })
        );
        data.overall = Object.values(overall);
        Object.keys(data).forEach((key) => {
          data[key].sort((a, b) => b.points - a.points);
          data[key].forEach((e, i) => (e.rank = i + 1));
        });
        this.rounds = data;
        this.setRound(data.overall, "overall");
      });
    });
  },
  data() {
    return {
      rounds: [],
      participants: [],
      leaders: [],
      roundKey: "overall",
      round: [],
      ordering: "ascending",
    };
  },
  methods: {
    setRound(round, key) {
      this.$data.round = __cloneObject(round);
      this.$data.leaders = __cloneObject(round).splice(0, 3);
      this.$data.participants = __cloneObject(round).splice(3);
      this.$data.roundKey = key;
    },
  },
});
