const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
const intialize = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3002,() => 
      console.log("success");
    );
  } catch (e) {
    console.log(`DB ERORR:${e.message}`);
    process.exit(1);
  }
};
intialize();

const convertDbObjectToResponseObject = (dbObject) =>{
    return {
        playerId:dbObject.player_id,
        playerName:dbObject.player_name,
        jerseyNumber:dbObject.jersey_number,
        role:dbObject.role
    }
}

app.get("/players/",async(request,response)=>{
    const getPlayersQuery =`
    SELECT * FROM cricket_team;`;
    const players = await db.all(getPlayersQuery)
    response.send(players.map(each)=>convertDbObjectToResponseObject(each))
});

app.get("/players/:playerId/",async(request,response)=>{
    const {playerId}= request.params;
    const getPlayerQuery = `
    SELECT * FROM cricket_team
    WHERE player_id = ${playerId};`;
    const player = await db.get(getPlayerQuery)
    response.send(convertDbObjectToResponseObject(player));
});

app.post("/players/",async(request,response)=>{
    const{playerName,jerseyNumber,role} = request.body;
    const postPlayerQuery=`
    INSERT INTO cricket-team (player_name,jersey_number,role)
    VALUES
    ('${playerName}',${jerseyNumber},'${role}');`;
    const postPlayer = await db.run(postPlayer)
    response.send("Player Added to Team");
});

app.put("/players/:playerId/",async(request,response)=>{
    const {playerName,jerseyNumber,role} = request.body;
    const {playerId} = request.params;
    const updatePlayerQuery = `
    UPDATE cricket_team
    SET
    player_name = '${playerName}',
    jersey_name = ${jerseyNumber},
    role = '${role}'
    WHERE player_id = ${playerId};`;
    
    await db.run(updatePlayerQuery)
    response.send("PlayerDetails Updated")
})

app.delete("/players/:playerId/",async(request,response)=>{
    const {playerId} = request.params;
    const deletePlayerQuery = `
    DELETE FROM cricket_team
    WHERE 
    player_id = ${playerId};`;
    await db.run(deletePlayerQuery);
    response.send("Player Removed");

});       

module.exports = app
