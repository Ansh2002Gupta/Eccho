export const formatDate = (dateString, showSeconds=false, useUTCFormat=false) => {
    const date = new Date(dateString);
    var hours = date.getUTCHours();
    var minutes = date.getUTCMinutes();
    var seconds = date.getUTCSeconds();

    if(useUTCFormat) {
        return showSeconds ? `${hours}:${minutes}:${seconds}` : `${hours}:${minutes}`;
    }

    const ampm = hours <= 12 ? "AM" : "PM";

    hours = hours%12;
    hours = hours ? hours : 12;

    minutes = minutes < 10? "0"+minutes : minutes;
    seconds = seconds < 10? "0"+seconds : seconds;

    if(showSeconds){
        return `${hours}:${minutes}:${seconds} ${ampm}`;
    }
    else{
        return `${hours}:${minutes} ${ampm}`;
    }
}
