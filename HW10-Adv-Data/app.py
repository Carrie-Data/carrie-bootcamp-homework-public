import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import datetime as dt

from flask import Flask, jsonify, request


#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///Resources/hawaii.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
Station = Base.classes.station
Measurement = Base.classes.measurement

# Create our session (link) from Python to the DB
session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")
def root():
    """List all available api routes."""

    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/precipitation<br/><br/>"
        f"/api/v1.0/stations<br/><br/>"
        f"/api/v1.0/tobs<br/><br/>"
        f"/api/v1.0/<start><br/>"
        f"Acceptable format: /api/v1.0/yyyy-mm-dd<br/><br/>"
        f"/api/v1.0/<start>/<end><br/>"
        f"Acceptable format: /api/v1.0/yyyy-mm-dd/yyyy-mm-dd<br/><br/>"
        f"Acceptable date range: 2010-01-01 - 2017-08-23<br/><br/>"
    )


@app.route("/api/v1.0/precipitation")
def precipitation():
    """Convert the query results to a Dictionary using date as the key and prcp as the value.
        Return the JSON representation of your dictionary."""

    # Create our session (link) from Python to the DB
    session = Session(engine)

    precipitation = (session
                     .query(Measurement.date, Measurement.prcp)
                     .order_by(Measurement.date)
                     .all())
    
    precip = []

    for i, val in enumerate(precipitation):
        precip.append({'Date': precipitation[i][0],
                         'Prcp': precipitation[i][1],
                         })

    return jsonify(precip)


@app.route("/api/v1.0/stations")
def stations():
    """Return a JSON list of stations from the dataset. 
    I added the station count for the fun of it"""
    # What are the most active stations? (i.e. what stations have the most rows)?
    # List the stations and the counts in descending order.
    station_stats = (session
                     .query(Measurement.station, func.count(Measurement.station))
                     .group_by(Measurement.station)
                     .order_by(func.count(Measurement.station).desc())
                     .all())

    stations = []

    for i, val in enumerate(station_stats):
        stations.append({'Station': station_stats[i][0],
                         'Station_Count': station_stats[i][1],
                        })

    return jsonify(stations)


@app.route("/api/v1.0/tobs")
def tobs():
    """query for the dates and temperature observations from a year from the last data point.
    Return a JSON list of Temperature Observations (tobs) for the previous year."""
    # Create our session (link) from Python to the DB
    session = Session(engine)
    end_date = dt.date(2017, 8, 23)

    start_date = end_date - dt.timedelta(days=365)

    temperature = (session
                   .query(Measurement.date, Measurement.tobs)
                   .filter(Measurement.date <= end_date, Measurement.date >= start_date)
                   .order_by(Measurement.date)
                   .all())

    one_year_temps = []

    for i, val in enumerate(temperature):
        one_year_temps.append({'Date': temperature[i][0],
                               'Temp': temperature[i][1],
                            })

    return jsonify(one_year_temps)


@app.route("/api/v1.0/<start>", methods = ['GET'])
def start_stats(start):

    """Return a JSON list of the minimum temperature, the average temperature, 
    and the max temperature for a given start or start-end range.
    When given the start only, calculate TMIN, TAVG, and TMAX for all dates 
    greater than and equal to the start date."""
    # Create our session (link) from Python to the DB
    session = Session(engine)

    latest_date = (session.query(Measurement.date)
                   .order_by(Measurement.date.desc())
                   .first())

    latest_date
    latest_date = list(latest_date)[0]  

    start_date_temperature = (session
                              .query(Measurement.date,
                                     func.min(Measurement.tobs),
                                     func.avg(Measurement.tobs),
                                     func.max(Measurement.tobs))
                              .filter(Measurement.date >= start)
                              .filter(Measurement.date <= latest_date)
                              .group_by(Measurement.date)
                              .all())

    start_date_temps = []

    for i, val in enumerate(start_date_temperature):
        start_date_temps.append({'Date': start_date_temperature[i][0],
                                 'TMIN': start_date_temperature[i][1],
                                 'TAVG': start_date_temperature[i][2],
                                 'TMAX': start_date_temperature[i][3]
                                })

    return jsonify(start_date_temps)


@app.route("/api/v1.0/<start>/<end>", methods=['GET'])
def start_end_stats(start,end):

    """Return a JSON list of the minimum temperature, the average temperature, 
    and the max temperature for a given start or start-end range.
    When given the start and the end date, calculate the TMIN, TAVG, 
    and TMAX for dates between the start and end date inclusive."""
    # Create our session (link) from Python to the DB
    session = Session(engine)

    date_range_temperature = (session
                              .query(Measurement.date,
                                     func.min(Measurement.tobs),
                                     func.avg(Measurement.tobs),
                                     func.max(Measurement.tobs))
                              .filter(Measurement.date >= start)
                              .filter(Measurement.date <= end)
                              .group_by(Measurement.date)
                              .all())

    range_temps = []
    
    for i, val in enumerate(date_range_temperature):
        range_temps.append({'Date': date_range_temperature[i][0],
                            'TMIN': date_range_temperature[i][1],
                            'TAVG': date_range_temperature[i][2],
                            'TMAX': date_range_temperature[i][3]
                            })

    return jsonify(range_temps)


if __name__ == '__main__':
    app.run(debug=True)
