IF OBJECT_ID(N'dbo.Todos', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Todos (
        Id INT IDENTITY(1, 1) PRIMARY KEY,
        Title NVARCHAR(200) NOT NULL,
        Description NVARCHAR(MAX) NULL,
        DateCreated DATETIME2 NOT NULL
            CONSTRAINT DF_Todos_DateCreated DEFAULT SYSUTCDATETIME(),
        IsCompleted BIT NOT NULL
            CONSTRAINT DF_Todos_IsCompleted DEFAULT 0
    );
END;