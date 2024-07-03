export const getRoomId = (userId1,userId2) =>{
   const sortIds = [userId1,userId2].sort();
   const roomId  = sortIds.join('-');
   return roomId;
}

export const fromDate = date =>{
   var day = date.getDate();
   var monthNames = ["Jan", "Feb", "Mar", "Apr","May", "Jun", "Jul", "Aug", "Sep","Oct", "Nov", "Dec"];
   var month = monthNames[date.getMonth()];

   var formattedDate = day + ' ' + month;
   return formattedDate;
}