import os
import csv

# Path to collect data from the Resources folder
BudgetCSV = os.path.join('.', 'budget_data.csv')

# Read in the CSV file
with open(BudgetCSV, 'r') as csvfile:

    # Split the data on commas
    csvreader = csv.reader(csvfile, delimiter=',')

    #Calculate Months
    header = next(csvreader)
    data = list(csvreader)
    months= int(len(data))

    #Set initial value/initialize a few variables
    total_profit = 0
    total_change = 0
    min_profit = int(data[1][1]) -int(data[0][1])
    max_profit = int(data[1][1]) -int(data[0][1])

    #Calculate total profit
    for row in data:
        total_profit += int(row[1]) 

    #Calculate the total change in profit from month to month
    for i in range(months - 1):
        top_price = int(data[i][1]) 
        bottom_price = int(data[i + 1][1])
        change= bottom_price - top_price
        total_change += change

        #In the same loop examime to change in profit to find the max and min change.
        if change < min_profit:
            min_profit = change
            month_min_profit = data[i + 1][0]

        if change > max_profit:
            max_profit = change
            month_max_profit = data[i + 1][0]

    #Calculate average change
    average = total_change/(months - 1)
    average = ("{0:.2f}".format(average))
  
    #print calculated values
    print("Financial Analysis")
    print("-------------------------")
    print(f"Total Months: {months}")
    print(f"Total: ${total_profit}")
    print(f"Average Change: ${average}")
    print("Greatest Increase in Profits: " + month_max_profit + "  ($" + str(max_profit) + ")")
    print("Greatest Decrease in Profits: " + month_min_profit + "  ($" + str(min_profit) + ")")
    print("-----")

#create text file and write results to it.
# Set variable for output file
output_file = os.path.join("Financial_Analysis.txt")

#  Open the output file
with open(output_file, "w", newline="") as datafile:
    datafile.write("Financial Analysis\n",)
    datafile.write("-------------------------\n")
    datafile.write(f"Total Months: {months}\n")
    datafile.write(f"Total: ${total_profit}\n")
    datafile.write(f"Average Change: ${average}\n")
    datafile.write("Greatest Increase in Profits: " + month_max_profit + "  ($" + str(max_profit) + ")\n")
    datafile.write("Greatest Decrease in Profits: " + month_min_profit + "  ($" + str(min_profit) + ")\n")
    datafile.write("-----")

    datafile.close()



    

    




