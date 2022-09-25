const express=require('express');
const bodyParser=require('body-parser');
const app=express();
const N=9;
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

function solveSudoku(grid, row, col)
{
    if (row == N - 1 && col == N)
        return true;
    if (col == N)
    {
        row++;
        col = 0;
    }

    if (grid[row][col] != 0)
        return solveSudoku(grid, row, col + 1);

    for(let num = 1; num < 10; num++)
    {

        if (isSafe(grid, row, col, num))
        {

            grid[row][col] = num;

            if (solveSudoku(grid, row, col + 1))
                return true;
        }

        grid[row][col] = 0;
    }
    return false;
}
function isSafe(grid, row, col, num)
{

    // Check if we find the same num
    // in the similar row , we
    // return false
    for(let x = 0; x <= 8; x++)
        if (grid[row][x] == num)
            return false;

    // Check if we find the same num
    // in the similar column ,
    // we return false
    for(let x = 0; x <= 8; x++)
        if (grid[x][col] == num)
            return false;

    // Check if we find the same num
    // in the particular 3*3
    // matrix, we return false
    let startRow = row - row % 3,
        startCol = col - col % 3;

    for(let i = 0; i < 3; i++)
        for(let j = 0; j < 3; j++)
            if (grid[i + startRow][j + startCol] == num)
                return false;

    return true;
}

app.post('/',(req,res)=>{
  const matrix=[]
  const mat=req.body.submission;
  let k=0;
  console.log(mat[0]);
  for(let i=0;i<9;i++){
    const temp=[];
    for(let j=0;j<9;j++){

      temp.push(parseInt(mat[k]));

      k++;
    }
    matrix.push(temp);
  }
    console.log(matrix);
    const ans=solveSudoku(matrix, 0, 0);
    console.log(ans);
    console.log(matrix);
    res.json({
      solved:ans,
      res:matrix
    })
  })



app.listen(process.env.PORT||8080,()=>{
    console.log("started");
});
