<template>
  <div class="container">
    <div :style="fillerStyles">
      <span class="label">{{ completedRate }}%</span>
    </div>
    <img v-if="completedRate < 80" :src="happyGanadi" alt="Happy Ganadi" class="bar_image" :style="imageStyles" />
    <img v-else :src="cryingGanadi" alt="Crying Ganadi" class="bar_image" :style="imageStyles" />
  <div id="goal_money" >
    <span>0원</span>
    <span>{{ goalMoney }}원</span>
  </div>
  </div>
</template>

<script>
import { computed } from "vue";
import happyGanadi from "@/assets/images/home_image/happy_ganadi.png";
import cryingGanadi from "@/assets/images/home_image/crying_ganadi.png";

export default {
  name: "ProgressBar",
  props: {
    bgcolor: String,
    completedRate: Number,
    goalMoney: Number,
  },
  setup(props) {
    const safeCompleted = computed(() => {
      return Math.min(Math.max(props.completedRate, 0), 100);
    });
    
    const fillerStyles = computed(() => {
      let backgroundColor = props.bgcolor;
      if (props.completedRate >= 80) {
        backgroundColor = '#FF9E9A'; // 붉은 분홍색
      } else if (props.completedRate >= 60) {
        backgroundColor = '#FFFBBE'; // 노란색
      }
      return {
        height: "100%",
        width: `${safeCompleted.value}%`,
        backgroundColor: backgroundColor,
        transition: "width 1s ease-in-out",
        borderRadius: "inherit",
        textAlign: "right",
        position: "relative",
      };
    });

    const imageStyles = computed(() => {
       return {
        left: `${safeCompleted.value}%`, 
        transition: "left 1s ease-in-out",
      };
    });

    return { fillerStyles, imageStyles, happyGanadi, cryingGanadi, safeCompleted };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  height: 20px;
  width: min(90%);
  background-color: #e0e0de;
  border-radius: 50px;
  margin: 40px auto;
  padding: 0;
  position: relative;
}

.label {
  padding: 5px;
  color: white;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.bar_image {
  position: absolute;
  top: -45%;
  transform: translate(-50%, -50%);

}
#goal_money{
    display: flex;
    justify-content: space-between;
}
</style>
