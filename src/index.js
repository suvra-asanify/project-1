import Avatar from './components/Avatar.vue';
import Chip from './components/Chip.vue';
import ComboBox from './components/ComboBox.vue';
import DateTimePicker from './components/DateTimePicker.vue';
import List from './components/List.vue';
import ProgressCircular from './components/ProgressCircular.vue';
import ProgressLinear from './components/ProgressLinear.vue';
import RichTextEditor from './components/RichTextEditor.vue';
import RadioButton from './components/RadioButton.vue';
import TextArea from './components/TextArea.vue';
import TextField from './components/TextField.vue';

const components = {
  Avatar,
  Chip,
  ComboBox,
  DateTimePicker,
  List,
  ProgressCircular,
  ProgressLinear,
  RichTextEditor,
  RadioButton,
  TextArea,
  TextField,
};

export const DesignSystem = {
  install(app) {
    for (const [name, component] of Object.entries(components)) {
      app.component(name, component);
    }
  },
};

export {
  Avatar,
  Chip,
  ComboBox,
  DateTimePicker,
  List,
  ProgressCircular,
  ProgressLinear,
  RichTextEditor,
  RadioButton,
  TextArea,
  TextField,
};
export * from './tokens.js';
