import { dailyMailsSetter } from "./dailySetter";
import { reminder } from "./reminder";
import { sessionsChecker } from "./sessionsChecker";

function cronProcesses() {
  dailyMailsSetter();
  reminder()
  sessionsChecker()
}

export default cronProcesses;
