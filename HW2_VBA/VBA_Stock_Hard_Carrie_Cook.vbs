'Yearly change from what the stock opened the year at to what the closing price was.
'The percent change from the what it opened the year at to what it closed.
'The total Volume of the stock
'Ticker symbol
'You should also have conditional formatting that will highlight positive 
'change in green and negative change in red.
'Your solution will also be able to locate the stock with the 
'"Greatest % increase", "Greatest % Decrease" and "Greatest total volume".


Sub Stock_hard()

Dim ws As Worksheet

For Each ws In Worksheets

Dim Ticker_Volume As Double
Dim table_summary As Integer
Dim opening_price As Double
Dim closing_price As Double
Dim Yearly_Change As Double
Dim summary_last_row As Integer

Ticker_Volume = 0
table_summary = 2

lastrow = ws.Cells(Rows.Count, 1).End(xlUp).Row

ws.Cells(1, 9) = "Ticker"
ws.Cells(1, 10) = "Yearly Change"
ws.Cells(1, 11) = "Percent Change"
ws.Cells(1, 12) = "Total Stock Volume"

'save off the opening price of the year for the first ticket
opening_price = ws.Cells(2, 3)

'loop through all rows, find where the ticker changes
For i = 2 To lastrow
    If ws.Cells(i + 1, 1) = ws.Cells(i, 1) Then
        Ticker_Volume = Ticker_Volume + ws.Cells(i, 7)
        'accumulate total volume
        
        'If opening price=0 then find the next non zero entry
        If opening_price = 0 Then
                opening_price = ws.Cells(i + 1, 3)
        End If
        
    Else
        'print out total volume and ticker name in summary table
        ws.Cells(table_summary, 9) = ws.Cells(i, 1)
        ws.Cells(table_summary, 12) = Ticker_Volume + ws.Cells(i, 7)
        
        'reset volume for change in ticker
        Ticker_Volume = 0
        
        'save closing price at the end of the year
        closing_price = ws.Cells(i, 6)
        
        'Save of Yearly Change be subracting opening from closing price
        Yearly_Change = closing_price - opening_price
        ws.Cells(table_summary, 10) = Yearly_Change
        
        'Color format Yearly Change
        If Yearly_Change >= 0 Then
            ws.Cells(table_summary, 10).Interior.ColorIndex = 4
        Else
            ws.Cells(table_summary, 10).Interior.ColorIndex = 3
        End If
        
        'Calculate Percent Change and push it to the summary table
        'If opening price is = 0, then set % = 0
        'This will only occur if all opening prices for that ticket = 0
        'Ticker PLNT 2014 opening and closing price is always zero
        'This if statement handles this situation
        If opening_price = 0 Then
            ws.Cells(table_summary, 11) = 0
        Else
            ws.Cells(table_summary, 11) = Yearly_Change / opening_price
            ws.Cells(table_summary, 11) = Format(ws.Cells(table_summary, 11), "Percent")
        End If
        
        'Set opening price to be the first occurance of each new ticket.
        opening_price = ws.Cells(i + 1, 3)
             
        'move the table summary down by one for thet next ticker
        table_summary = table_summary + 1
        
    End If
Next i

'Define headers for new table- mins and maxs
ws.Cells(1, 16) = "Ticker"
ws.Cells(1, 17) = "Value"
ws.Cells(2, 15) = "Greatest % Increase"
ws.Cells(3, 15) = "Greatest % Decrease"
ws.Cells(4, 15) = "Greatest Total Volume"

'find last row for summary table
summary_last_row = ws.Cells(Rows.Count, 9).End(xlUp).Row

'Calculate the minimums and maximums for the Hard challenge
ws.Cells(2, 17) = Application.WorksheetFunction.Max(ws.Range("K2:K" & summary_last_row))
ws.Cells(2, 17) = Format(ws.Cells(2, 17), "Percent")
ws.Cells(3, 17) = Application.WorksheetFunction.Min(ws.Range("K2:K" & summary_last_row))
ws.Cells(3, 17) = Format(ws.Cells(3, 17), "Percent")
ws.Cells(4, 17) = Application.WorksheetFunction.Max(ws.Range("L2:L" & summary_last_row))

'Find Tickers associated with min and max table
For i = 2 To summary_last_row

    'Find Ticker for Greatest % Increase
    If ws.Cells(i, 11) = ws.Cells(2, 17) Then
        ws.Cells(2, 16) = ws.Cells(i, 9)
    End If
    
    'Find Ticker for Greatest % Decrease
    If ws.Cells(i, 11) = ws.Cells(3, 17) Then
        ws.Cells(3, 16) = ws.Cells(i, 9)
    End If
    
    'Find Ticker for Greatest Total Volume
    If ws.Cells(i, 12) = ws.Cells(4, 17) Then
        ws.Cells(4, 16) = ws.Cells(i, 9)
    End If
    
Next i

'AutoFit columns in each sheet so headers a visible
ws.Cells.EntireColumn.AutoFit

Next ws

End Sub