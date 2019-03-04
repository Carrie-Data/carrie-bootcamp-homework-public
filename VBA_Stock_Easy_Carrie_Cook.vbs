'Create a script that will loop through each year of stock data and grab the total 
'amount of volume each stock had over the year.
'You will also need to display the ticker symbol to coincide with the total volume.

Sub Stock_easy()

Ticker_Volume = 0
table_summary = 2

For Each ws In Worksheets

lastrow = ws.Cells(Rows.Count, 1).End(xlUp).Row

ws.Cells(1, 9) = "Ticker"
ws.Cells(1, 10) = "Total Stock Volume"

'loop through all rows, find where the ticker changes
For i = 2 To lastrow
    If ws.Cells(i + 1, 1) = ws.Cells(i, 1) Then
        Ticker_Volume = Ticker_Volume + ws.Cells(i, 3)
        'Accumulate the volume total per ticker
        
    Else
        'When the ticker changes symbols save off total to summary and reset
        ws.Cells(table_summary, 9) = ws.Cells(i, 1)
        ws.Cells(table_summary, 10) = Ticker_Volume + ws.Cells(i, 3)
        Ticker_Volume = 0
        
        'increment the summary table by one row each time the ticker changes
        table_summary = table_summary + 1
    End If
Next i

'AutoFit columns in each sheet so headers a visible
ws.Cells.EntireColumn.AutoFit

Next ws

End Sub