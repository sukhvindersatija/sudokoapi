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
function checkrow(matrix){
    for(let i=0;i<9;i++){
        const hash1=new Array(10).fill(0);
        for(let j=0;j<9;j++){
            if(matrix[i][j]===0){
                continue;
            }
            else if(hash1[matrix[i][j]]!=0){
                return false;
            }
            else{
                hash1[matrix[i][j]]=1;
            }
        }
    }
    return true;
}

function checkcol(matrix){
    for(let i=0;i<9;i++){
        const hash2=new Array(10).fill(0);
        for(let j=0;j<9;j++){
            if(matrix[j][i]===0){
                continue;
            }
            else if(hash2[matrix[j][i]]!=0){
                return false;
            }
            else{
                hash2[matrix[j][i]]=1;
            }
        }
    }
    return true;
}
function checkgrid(matrix){
    /* for(let i=0;i<9;i++){
        for(let j=0;j<9;j++){
            if(matrix[i][j]!=0){
                let num=matrix[i][j];
                let startRow = i - i % 3,
                startCol = j - j % 3;

                for(let m = 0; m < 3; m++)
                    for(let n = 0; n < 3; n++)
                        if (matrix[m + startRow][n + startCol] == num)
                            return false;

                
            }
        }
    }
    return true; */
   
    const rows=[0,3,6];
    const col=[0,3,6];
    for(let m=0;m<3;m++){
        for(let n=0;n<3;n++){
            const hash3=new Array(10).fill(0);
            for(let i=rows[m];i<rows[m]+3;i++){
                for(let j=col[n];j<col[n]+3;j++){
                    if(matrix[i][j]===0){
                        continue;
                    }
                    else if(hash3[matrix[i][j]]!=0){
                        console.log(i,j);
                        return false;
                    }
                    else{
                        hash3[matrix[i][j]]=1;
                    }
                }
            }
       }
    }
    return true;
    
}

app.post('/',(req,res,next)=>{
  const matrix=[]
  const mat=req.body.submission;
  let k=0;
  console.log(mat);
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
    colSafe=checkcol(matrix);
    gridSafe=checkgrid(matrix);
    rowSafe=checkrow(matrix);
    if(!colSafe){
        res.json({
            solved:false,
            res:"Number repeated in a column"
        });
       
    }
   
    else if(!rowSafe){
        res.json({
            solved:false,
            res:"Number repeated in a row"
        });
    }
    
    else if(!gridSafe){
        res.json({
            solved:false,
            res:"Number repeated in a 3x3 grid"
        });
        next();
    }
    else{
        console.log("struck");
    const ans=solveSudoku(matrix, 0, 0);
    console.log(ans);
    console.log(matrix);
    if(!ans){
        res.json({
            solved:ans,
            res:"This sudoko can't be solved"
        });
        next();
    }
    res.json({
      solved:ans,
      res:matrix
    })
}
  })



app.listen(process.env.PORT||8080,()=>{
    console.log("started");
});
