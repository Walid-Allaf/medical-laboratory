import Resizer from "react-image-file-resizer";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import locale from "dayjs/locale/ar";

export const dateAgo = (date) => {
  dayjs.extend(relativeTime).locale(locale);
  return dayjs(date).add(1, "hour").fromNow();
};

var i = 0;
var txt = "Lorem ipsum dummy\ntext blabla.";
var speed = 50;

export const typeWriter = () => {
  if (i < txt.length) {
    document.getElementById("demo").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
};

export const compressImg = async (image) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      image,
      300,
      300,
      "JPEG",
      100,
      0,
      (uri) => {
        const img = uri.substring(uri.indexOf(",") + 1);
        console.log("Compressed");
        resolve(img);
      },
      "base64"
    );
  });
