module.exports = function generateToken(l=32)
{
    let ref='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.@#$%^&|?';
    let str=" ";
    while(str.length!=l)
    {
        let tokenIndex=Math.floor(Math.random()*(ref.length-1)+1)
        str=str+ref[tokenIndex];
    }
    return str.trim();
}


